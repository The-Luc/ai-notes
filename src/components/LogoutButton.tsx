"use client";

import React, { useState } from "react";
import { Button } from "./ui/button";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

function LogoutButton() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogout = async () => {
    console.log("Logout");
    setLoading(true);
    // TODO: Logout
    await new Promise((r) => setTimeout(r, 2000));

    const errorMessage = null;

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

    setLoading(false);
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
