"use client";

import { User } from "@supabase/supabase-js";
import React, { useEffect, useRef, useState, useTransition } from "react";
import { Button } from "./button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./dialog";
import { Bot, Loader2, User2 } from "lucide-react";
import { Textarea } from "./textarea";
import { toast } from "sonner";
import { chatWithGemini } from "../../actions/gemini";

interface IProps {
  user: User | null;
}

export interface IMessage {
  role: "user" | "model";
  content: string;
}

function AskAIButton({ user }: IProps) {
  const [open, setOpen] = useState(false);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [input, setInput] = useState<string>();
  const [messages, setMessages] = useState<IMessage[]>([]);
  const [isPending, startTransition] = useTransition();
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    //  load messages from local storage
    const savedMessages = localStorage.getItem("messages");
    if (savedMessages) {
      setMessages(JSON.parse(savedMessages));
    }
  }, []);

  if (!user) return null;

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

  const scrollToBottom = () => {
    scrollRef.current?.scrollTo({
      top: scrollRef.current.scrollHeight,
      behavior: "smooth",
    });
  };

  const askAI = async () => {
    const text = input?.trim();
    if (!text) {
      toast.warning("What do you want to ask? Please tell me 🤖");
      return;
    }

    startTransition(async () => {
      try {
        setMessages((prev) => [...prev, { role: "user", content: text }]);

        const { errorMessage, response } = await chatWithGemini(text, messages);
        if (errorMessage) {
          toast.error("Failed to ask AI", { description: errorMessage });
          return;
        }
        setMessages((prev) => [
          ...prev,
          { role: "model", content: response || "" },
        ]);
        setInput("");

        // save messages to local storage
        localStorage.setItem(
          "messages",
          JSON.stringify([
            ...messages,
            { role: "model", content: response || "" },
          ]),
        );

        // scroll to bottom
        setTimeout(() => {
          scrollToBottom();
        }, 500);
      } catch (error) {
        console.error(error);

        toast.error("An error occurred!");
      }
    });
  };

  const clearChat = () => {
    setMessages([]);
    localStorage.removeItem("messages");
  };

  const renderEmptyMessage = () => {
    return (
      <div className="flex flex-col items-center gap-4">
        <p className="text-muted-foreground">
          Start a conversation with AI about your notes
        </p>
      </div>
    );
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger>
        <Button variant="secondary">Ask AI</Button>
      </DialogTrigger>
      <DialogContent
        className={` ${
          isFullScreen
            ? "h-screen w-screen !max-w-none justify-center"
            : "h-[85vh] sm:max-w-[625px]"
        } `}
        onEscapeKeyDown={handleKeyDown}
      >
        <DialogHeader>
          <DialogTitle>Ask AI</DialogTitle>
          <DialogDescription>Chat with AI about your notes</DialogDescription>
        </DialogHeader>

        <div
          className={`h-min-[400px] custom-scrollbar space-y-4 overflow-y-auto rounded-md border p-4 ${isFullScreen ? "h-[58vh] w-[60vw] flex-grow" : ""}`}
          ref={scrollRef}
        >
          {messages.length === 0
            ? renderEmptyMessage()
            : messages.map((message, index) => (
                <MessageItem key={index} message={message} />
              ))}
        </div>

        <div className="flex flex-col items-center gap-4">
          <Textarea
            className={`placeholder:text-muted-foreground mb-4 max-w-4xl border p-4 focus-visible:ring-0 focus-visible:ring-offset-0 ${isFullScreen ? "w-[60vw] flex-grow" : ""}`}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Enter your question here..."
            value={input}
          />
        </div>
        <DialogFooter className="flex !justify-center">
          <div
            className={`flex w-full justify-between ${isFullScreen ? "max-w-[70vw]" : ""}`}
          >
            <div className="flex items-center gap-2">
              <Button variant="outline" onClick={toggleFullScreen}>
                {isFullScreen ? "Exit Full screen" : "Full screen"}
              </Button>
              <Button variant="outline" onClick={clearChat}>
                Clear Chat
              </Button>
            </div>
            <Button onClick={askAI} disabled={isPending} className="w-24">
              {isPending ? (
                <span className="animate-pulse">Thinking...</span>
              ) : (
                "Send"
              )}
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function MessageItem({ message }: { message: IMessage }) {
  return (
    <div
      className={`flex flex-col gap-3 ${message.role === "user" ? "items-end" : "items-start"}`}
    >
      <div
        className={`flex w-[80%] items-center justify-start gap-3 rounded-md border p-1 ${message.role === "user" ? "bg-ring flex-row-reverse" : "bg-muted justify-start"}`}
      >
        <div className="bg-muted rounded-full p-2">
          {message.role === "user" ? <User2 /> : <Bot />}
        </div>

        <p className="">
          {message.role === "model" ? (
            <div dangerouslySetInnerHTML={{ __html: message.content }} />
          ) : (
            message.content
          )}
        </p>
      </div>
    </div>
  );
}

export default AskAIButton;
