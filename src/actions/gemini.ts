

import { GoogleGenerativeAI } from "@google/generative-ai";
import { prisma } from '../db/prisma';
import { getUser } from '../app/auth/server';
import { Note } from '@prisma/client';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

const createPrompt = (notes: Note[]) => `
You are a helpful assistant that answers questions about a user's notes. 
Assume all questions are related to the user's notes. 
Make sure that your answers are not too verbose and you speak succinctly. 
Your responses MUST be formatted in clean, valid HTML with proper structure. 
Use tags like <p>, <strong>, <em>, <ul>, <ol>, <li>, <h1> to <h6>, and <br> when appropriate. 
Do NOT wrap the entire response in a single <p> tag unless it's a single paragraph. 
Avoid inline styles, JavaScript, or custom attributes.

Rendered like this in JSX:
<p dangerouslySetInnerHTML={{ __html: YOUR_RESPONSE }} />
Here are the user's notes:
${notes.map(note => `Note: ${note.text}. Created at: ${note.createdAt}. Updated at: ${note.updatedAt}`).join('\n')}
`


export async function chatWithGemini() {
	const user = await getUser();

	if (!user) return null;

	const notes = await prisma.note.findMany({
		where: {
			authorId: user.id,
		},
		orderBy: {
			updatedAt: "desc",
		},
	});



	const response = await model.generateContent(createPrompt(notes));

	return response.response;
}
