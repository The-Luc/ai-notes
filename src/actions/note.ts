'use server'

import { revalidatePath, revalidateTag, unstable_cache } from 'next/cache';
import { getUser } from '../app/auth/server';
import { prisma } from '../db/prisma';
import { handleError } from '../lib/utils'
import { Note } from '@prisma/client';

// Define return types for better type safety
type NoteActionSuccess = {
	errorMessage: null;
	note: Note;
}

type NoteActionError = {
	errorMessage: string;
	note?: undefined;
}

type NoteActionResult = NoteActionSuccess | NoteActionError;
type UpdateNoteActionResult = { errorMessage: null } | { errorMessage: string };

export const createNoteAction = async (text?: string): Promise<NoteActionResult> => {
	try {
		const user = await getUser();

		if (!user)
			throw new Error('You must be logged in to create a note')

		const note = await prisma.note.create({
			data: {
				text: text || '',
				authorId: user.id,
			},
		})
		// revalidate the notes list
		revalidateTag("notes");

		return { errorMessage: null, note };
	} catch (error) {
		return handleError(error) as NoteActionError;
	}
}

export const updateNoteAction = async (noteId: string, text: string): Promise<UpdateNoteActionResult> => {
	try {
		const user = await getUser();

		if (!user) {
			throw new Error('You must be logged in to update a note')
		}

		await prisma.note.update({
			where: {
				id: noteId,
			},
			data: {
				text,
				authorId: user.id,
			},
		})

		// revalidate the notes list
		revalidateTag("notes");

		return { errorMessage: null }
	} catch (error) {
		return handleError(error) as NoteActionError;
	}
}

export const deleteNoteAction = async (noteId: string) => {
	try {
		const user = await getUser();

		if (!user) {
			throw new Error('You must be logged in to delete a note')
		}

		await prisma.note.delete({
			where: {
				id: noteId,
			},
		})

		// revalidate the notes list
		revalidateTag("notes");

		return { errorMessage: null }
	} catch (error) {
		return handleError(error) as NoteActionError;
	}
}

export const getNotesAction = async (userId: string) => {
	if (!userId) return [];

	const notes: Note[] = await prisma.note.findMany({
		where: {
			authorId: userId,
		},
		orderBy: {
			updatedAt: "desc",
		},
	});

	unstable_cache(async () => notes, [userId], {
		tags: ["notes", userId],
	})

	return notes;
};