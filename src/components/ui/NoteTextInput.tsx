"use client";

import React, { useEffect } from "react";
import { Textarea } from "./textarea";
import useNote from "../../hooks/useNote";
import { DEBOUNCE_DELAY } from "../../lib/constant";
import { updateNoteAction } from "../../actions/note";
import { toast } from "sonner";

type IProps = {
  noteId: string;
  startingNoteText: string;
};

let updateTimeout: NodeJS.Timeout | null = null;

function NoteTextInput({ noteId, startingNoteText }: IProps) {
  const { noteText, setNoteText } = useNote();

  useEffect(() => {
    // TODO: why do I need to check: notedId vs paramNoteId?
    setNoteText(startingNoteText);
  }, [startingNoteText, setNoteText]);

  const handleOnChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const text = e.target.value || "";
    setNoteText(text);

    if (updateTimeout) clearTimeout(updateTimeout);

    updateTimeout = setTimeout(async () => {
      const { errorMessage } = await updateNoteAction(noteId, text);
      if (errorMessage) {
        toast.error("Failed to update note", {
          description: errorMessage,
        });
      }
    }, DEBOUNCE_DELAY);
  };
  return (
    <Textarea
      className="custom-scrollbar placeholder:text-muted-foreground mb-4 h-full max-w-4xl border p-4 focus-visible:ring-0 focus-visible:ring-offset-0"
      onChange={handleOnChange}
      placeholder="Enter your note here..."
      value={noteText}
    />
  );
}

export default NoteTextInput;
