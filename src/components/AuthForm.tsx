"use client";

import { useRouter } from "next/navigation";
import React, { useTransition, useState } from "react";
import { CardContent, CardFooter } from "./ui/card";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Loader2 } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import { loginAction, signupAction } from "../actions/users";

type IPros = {
  type: "login" | "signup";
};

function AuthForm({ type }: IPros) {
  const isLoginForm = type === "login";
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [formData, setFormData] = useState({
    email: "",
    password: ""
  });

  const handleLogin = async (email: string, password: string) => {
    const { errorMessage } = await loginAction(email, password);

    if (errorMessage) {
      toast.error("Login failed", {
        description: errorMessage,
      });
      return false;
    }

    toast.success("Login successful");
    router.replace("/");
    return true;
  };

  const handleSignup = async (email: string, password: string) => {
    const { errorMessage } = await signupAction(email, password);

    if (errorMessage) {
      toast.error("Signup failed", {
        description: errorMessage,
      });
      return false;
    }

    toast.success("Signup successful");
    router.replace("/");
    return true;
  };

  const handleSubmit = async (formDataSubmit: FormData) => {
    const email = formDataSubmit.get("email") as string;
    const password = formDataSubmit.get("password") as string;
    
    // Update state with the submitted values to preserve them
    setFormData({ email, password });

    startTransition(async () => {
      let success;
      if (isLoginForm) {
        success = await handleLogin(email, password);
      } else {
        success = await handleSignup(email, password);
      }
      
      // If authentication was successful, clear the form data
      if (success) {
        setFormData({ email: "", password: "" });
      }
    });
  };
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const buttonName = isLoginForm ? "Login" : "Sign Up";

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
              value={formData.email}
              onChange={handleInputChange}
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
              value={formData.password}
              onChange={handleInputChange}
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
