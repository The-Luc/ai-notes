"use client";

import { User } from "@supabase/supabase-js";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useState, useTransition } from "react";
import { toast } from "sonner";
import { createNoteAction } from "../actions/note";
import { Button } from "./ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { Textarea } from "./ui/textarea";

interface IProps {
  user: User | null;
}

function CreateNoteDialog({ user }: IProps) {
  const [text, setText] = useState<string>();
  const [isFullScreen, setIsFullScreen] = useState<boolean>(false);
  const [isPending, startTransition] = useTransition();
  const [open, setOpen] = useState<boolean>(false);
  const router = useRouter();

  if (!user) return null;

  const handleOnChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const text = e.target.value || "";
    setText(text);
  };

  const handleCreateNote = async () => {
    if (!text) {
      toast.error("Note text is required");
      return;
    }

    startTransition(async () => {
      try {
        const { errorMessage, note } = await createNoteAction(text);
        if (errorMessage) {
          toast.error("Failed to create note", { description: errorMessage });
          return;
        }

        toast.success("Note created");
        setIsFullScreen(false);
        setOpen(false);
        setText("");
        router.push(`/?noteId=${note?.id}`);
      } catch (error) {
        console.error(error);
        toast.error("Failed to create note");
      }
    });
  };

  const toggleFullScreen = () => {
    setIsFullScreen(!isFullScreen);
  };

  const handleKeyDown = (event: KeyboardEvent) => {
    const isEscapeKey = event.key === "Escape";
    if (!isFullScreen || !isEscapeKey) return;

    event.stopPropagation();
    event.preventDefault();
    toggleFullScreen();
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger>
        <Button variant="outline">Create Note Dialog</Button>
      </DialogTrigger>
      <DialogContent
        className={
          isFullScreen ? "h-screen w-screen !max-w-none" : "sm:max-w-[625px]"
        }
        onEscapeKeyDown={handleKeyDown}
      >
        <DialogHeader>
          <DialogTitle>Create Note</DialogTitle>
          <DialogDescription>
            Enter your note in the textarea below then click Save
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col items-center gap-4">
          <Textarea
            className={`placeholder:text-muted-foreground mb-4 h-40 max-w-4xl border p-4 focus-visible:ring-0 focus-visible:ring-offset-0 ${isFullScreen ? "max-w-[70vw] flex-grow" : ""}`}
            onChange={handleOnChange}
            placeholder="Enter your note here..."
            value={text}
          />
        </div>
        <DialogFooter className="flex !justify-center">
          <div
            className={`flex w-full justify-between ${isFullScreen ? "max-w-[70vw]" : ""}`}
          >
            <Button variant="outline" onClick={toggleFullScreen}>
              {isFullScreen ? "Exit Full screen" : "Full screen"}
            </Button>
            <Button
              type="submit"
              onClick={handleCreateNote}
              disabled={isPending}
              className="w-24"
            >
              {isPending ? <Loader2 className="animate-spin" /> : "Save"}
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default CreateNoteDialog;
