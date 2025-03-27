"use client";

import React, { useTransition } from "react";
import { Button } from "./ui/button";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { logoutAction } from "../actions/users";

function LogoutButton() {
  const [loading, startTransition] = useTransition();
  const router = useRouter();

  const handleLogout = async () => {
    console.log("Logout");
    startTransition(async () => {
      const { errorMessage } = await logoutAction();

      if (!errorMessage) {
        toast.success("Logout successful", {
          description: "You have been logged out successfully",
        });

        // redirect to homepage
        router.push("/");
      } else {
        toast.error("Logout failed", {
          description: errorMessage,
        });
      }
    });
  };

  return (
    <Button
      onClick={handleLogout}
      disabled={loading}
      className="w-24"
      variant="outline"
    >
      {loading ? <Loader2 className="animate-spin" /> : "Logout"}
    </Button>
  );
}

export default LogoutButton;
