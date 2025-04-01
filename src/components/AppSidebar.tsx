import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarHeader,
} from "@/components/ui/sidebar";
import { Note } from "@prisma/client";
import Link from "next/link";
import { getNotesAction } from "../actions/note";
import { getUser } from "../app/auth/server";
import MySidebarContent from "./SidebarContent";

export async function AppSidebar() {
  const user = await getUser();

  const notes: Note[] = await getNotesAction(user?.id || "");

  return (
    <Sidebar>
      <SidebarHeader>Your AI Notes Assistant</SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="text-lg font-semibold">
            {user ? (
              "Your notes"
            ) : (
              <Link className="text-blue-500 underline" href="/login">
                Login
              </Link>
            )}
          </SidebarGroupLabel>

          <MySidebarContent notes={notes} />
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>Luc Thi @2025</SidebarFooter>
    </Sidebar>
  );
}
