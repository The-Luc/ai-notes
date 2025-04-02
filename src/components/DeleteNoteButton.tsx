"use client";

import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";
import React, { useTransition } from "react";
import {
  AlertDialogHeader,
  AlertDialogFooter,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { deleteNoteAction } from "../actions/note";
import { toast } from "sonner";
import { useRouter, useSearchParams } from "next/navigation";

interface IProps {
  noteId: string;
}

function DeleteNoteButton({ noteId }: IProps) {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();
  const searchParam = useSearchParams();
  const paramNoteId = searchParam.get("noteId");
  console.log(noteId);

  const handleDelete = () => {
    startTransition(async () => {
      const res = await deleteNoteAction(noteId);

      if (res.errorMessage) {
        toast.error(res.errorMessage);
      } else {
        toast.success("Note deleted");

        if (noteId === paramNoteId) {
          router.push("/");
        }
      }
    });
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button
          className="absolute top-1/2 right-1 -translate-y-1/2 opacity-0 group-hover/item:opacity-100"
          variant="ghost"
        >
          <Trash2 className="text-red-500" />
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete your note
            from our servers.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDelete}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/50"
          >
            {isPending ? "Deleting..." : "Delete"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

export default DeleteNoteButton;
