"use client";

import {
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { Input } from "./ui/input";
import { Search } from "lucide-react";
import { useMemo, useState } from "react";
import { Note } from "@prisma/client";
import Fuse from "fuse.js";
import Link from "next/link";
import useNote from "../hooks/useNote";
import { useSearchParams } from "next/navigation";
import DeleteNoteButton from "./DeleteNoteButton";

interface MySidebarContentProps {
  notes: Note[];
}

function MySidebarContent({ notes }: MySidebarContentProps) {
  const [search, setSearch] = useState("");
  const { noteText } = useNote();
  const searchParam = useSearchParams();
  const noteId = searchParam.get("noteId");

  const fuse = useMemo(
    () =>
      new Fuse(notes, {
        keys: ["text"],
        threshold: 0.4,
      }),
    [notes],
  );

  const results = search ? fuse.search(search).map((r) => r.item) : notes;

  const getShowText = (note: Note) => {
    if (note.id !== noteId) return note.text;
    return noteText || "EMPTY NOTE";
  };

  return (
    <>
      <SidebarGroupContent>
        <SidebarMenu>
          <SidebarMenuItem key={"new"}>
            <div className="relative my-3 w-full">
              <Search className="absolute top-1/2 left-2 h-4 w-4 -translate-y-1/2 text-gray-500" />
              <Input
                placeholder="Search notes"
                className="pl-8"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarGroupContent>
      <SidebarGroupContent>
        <SidebarMenu>
          {results.map((note) => (
            <SidebarMenuItem key={note.id} className="group/item relative">
              <SidebarMenuButton asChild>
                <Link
                  href={`/?noteId=${note.id}`}
                  className={`flex h-fit flex-col items-start ${note.id === noteId ? "bg-input" : ""}`}
                >
                  <p className="w-full truncate text-ellipsis">
                    {getShowText(note)}
                  </p>
                  <p className="text-xs">
                    {note.updatedAt.toLocaleDateString()}
                  </p>
                </Link>
              </SidebarMenuButton>
              <DeleteNoteButton noteId={note.id} />
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarGroupContent>
    </>
  );
}

export default MySidebarContent;
