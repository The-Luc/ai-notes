import React from "react";
import { getUser } from "./auth/server";
import { prisma } from "../db/prisma";
import { Note } from "@prisma/client";
import AskAIButton from "../components/ui/AskAIButton";
import NewNoteButton from "../components/ui/NewNoteButton";
import NoteTextInput from "../components/ui/NoteTextInput";

type IProps = {
  searchParams: Promise<{ [key: string]: string | undefined }>;
};

async function Homepage({ searchParams }: IProps) {
  const noteId = (await searchParams).noteId || "";

  const user = await getUser();

  const note: Note | null = await prisma.note.findUnique({
    where: {
      id: noteId,
      authorId: user?.id,
    },
  });

  {
    /* <div className='flex h-full flex-col items-center gap-4'> */
  }
  return (
    <div className="flex h-full flex-col gap-4 pb-4">
      {/* <div className='flex w-full max-w-4xl justify-end gap-2' > */}
      <div className="flex gap-2">
        <AskAIButton user={user} />
        <NewNoteButton user={user} />
      </div>

      <NoteTextInput noteId={noteId} startingNoteText={note?.text || ""} />
    </div>
  );
}

export default Homepage;
