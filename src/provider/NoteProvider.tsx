"use client";
import React, { createContext } from "react";

// define type
type NoteProviderContextType = {
  noteText: string;
  setNoteText: (text: string) => void;
};

// create context
export const NoteProviderContext = createContext<NoteProviderContextType>({
  noteText: "",
  setNoteText: () => {},
});

// create provider
function NoteProvider({ children }: { children: React.ReactNode }) {
  const [noteText, setNoteText] = React.useState("");

  return (
    <NoteProviderContext.Provider value={{ noteText, setNoteText }}>
      {children}
    </NoteProviderContext.Provider>
  );
}

// export provider
export default NoteProvider;
