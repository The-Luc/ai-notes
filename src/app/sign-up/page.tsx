"use client";

import React from "react";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import AuthForm from "../../components/AuthForm";

function SignUpPage() {
  return (
    <div className="mt-20 flex flex-1 justify-center bg-gray-50">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-center text-3xl">Sign Up</CardTitle>
        </CardHeader>

        <AuthForm type="signup" />
      </Card>
    </div>
  );
}

export default SignUpPage;
