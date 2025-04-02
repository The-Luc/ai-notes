import { NextResponse } from 'next/server';
import { getUser } from '../../auth/server';
import { prisma } from '../../../db/prisma';
import { debugAuth } from '../../../lib/utils';


export async function GET() {
	debugAuth('create-note')
	const user = await getUser();

	if (!user) return NextResponse.redirect(new URL('/login', process.env.NEXT_PUBLIC_BASE_URL!))

	const newNote = await prisma.note.create({
		data: {
			authorId: user.id,
			text: '',
		},
	})

	return NextResponse.redirect(new URL(`/?noteId=${newNote.id}`, process.env.NEXT_PUBLIC_BASE_URL!))
}