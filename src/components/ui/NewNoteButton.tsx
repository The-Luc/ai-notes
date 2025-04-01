"use client";

import { User } from "@supabase/supabase-js";
import React, { useTransition } from "react";
import { Button } from "./button";
import { createNoteAction } from "../../actions/note";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";

type IProps = {
  user: User | null;
};

function NewNoteButton({ user }: IProps) {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const handleCreateNote = () => {
    if (!user) {
      toast.error("You must be logged in to create a note");
      return;
    }

    startTransition(async () => {
      try {
        const result = await createNoteAction();

        if (result.errorMessage) {
          toast.error(result.errorMessage);
        } else {
          toast.success("Note created successfully");
          router.push(`/?noteId=${result.note?.id}`);
        }
      } catch (error) {
        toast.error("Failed to create note");
        console.error("Error creating note:", error);
      }
    });
  };

  return (
    <Button
      className=""
      variant="outline"
      onClick={handleCreateNote}
      disabled={isPending || !user}
    >
      {isPending ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Creating...
        </>
      ) : (
        "New Note"
      )}
    </Button>
  );
}

export default NewNoteButton;
