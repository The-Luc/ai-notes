"use client";

import { useRouter } from "next/navigation";
import React, { useTransition } from "react";
import { CardContent, CardFooter } from "./ui/card";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Loader2 } from "lucide-react";
import Link from "next/link";

type IPros = {
  type: "login" | "signup";
};

function AuthForm({ type }: IPros) {
  const isLoginForm = type === "login";
  const router = useRouter();
  const { isPending, startTransition } = useTransition();

  const handleSubmit = async (formData: FormData) => {
    console.log(formData);
  };

  const buttonName = isLoginForm ? "Login" : "Logout";

  return (
    <div>
      <form action={handleSubmit} className="space-y-4">
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              name="email"
              type="email"
              required
              placeholder="Enter your email"
              disabled={isPending}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              name="password"
              type="password"
              required
              placeholder="Enter your password"
              disabled={isPending}
            />
          </div>
        </CardContent>
        <CardFooter className="flex flex-col gap-2">
          <Button className="w-full" type="submit" disabled={isPending}>
            {isPending ? <Loader2 className="animate-spin" /> : buttonName}
          </Button>
          <p>
            {isLoginForm
              ? "Don't have an account?"
              : "Already have an account?"}{" "}
            <Link
              className={`text-blue-600 underline ${isPending ? "pointer-events-none opacity-50" : ""}`}
              href={isLoginForm ? "/sign-up" : "/login"}
            >
              {isLoginForm ? "Sign Up" : "Login"}
            </Link>
          </p>
        </CardFooter>
      </form>
    </div>
  );
}

export default AuthForm;
