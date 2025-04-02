import { User } from "@supabase/supabase-js";
import React from "react";
import { Button } from "./button";

interface IProps {
  user: User | null;
}

function AskAIButton({ user }: IProps) {
  return (
    <Button className="" variant="secondary">
      Ask AI
    </Button>
  );
}

export default AskAIButton;
