import React from "react";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import AuthForm from "../../components/AuthForm";

function LoginPage() {
  console.log("Login page");
  return (
    <div className="mt-20 flex flex-1 justify-center">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-center text-3xl">Login</CardTitle>
        </CardHeader>

        <AuthForm type="login" />
      </Card>
    </div>
  );
}

export default LoginPage;
