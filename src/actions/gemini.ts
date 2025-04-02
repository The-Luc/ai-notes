'use server'

import { GoogleGenerativeAI } from "@google/generative-ai";
import { prisma } from '../db/prisma';
import { getUser } from '../app/auth/server';
import { Note } from '@prisma/client';
import { IMessage } from '../components/ui/AskAIButton';
import { handleError } from '../lib/utils';

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

Please answer the user's question.`


export async function chatWithGemini(input: string, messages: IMessage[]) {
	try {
		const user = await getUser();

		if (!user) return { errorMessage: "You must be logged in to ask AI" };

		const notes = await prisma.note.findMany({
			where: {
				authorId: user.id,
			},
			orderBy: {
				updatedAt: "desc",
			},
		});

		const history = messages.map(m => ({
			role: m.role,
			parts: [{ text: m.content }]
		}));

		const systemInstruction = createPrompt(notes);
		const chat = model.startChat({
			history,
			systemInstruction: {
				parts: [{ text: systemInstruction }],
				role: "system"
			}
		})
		const response = await chat.sendMessage(input);

		return { response: response.response.text(), errorMessage: null };
	} catch (error) {
		console.error(error);
		return handleError(error) as { errorMessage: string };
	}

}