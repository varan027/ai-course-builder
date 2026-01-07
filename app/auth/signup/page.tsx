"use client";

import { signIn } from "next-auth/react";
import Button from "@/components/ui/Button";

export default function SignUpPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-black">
      <div className="w-full max-w-md p-6 rounded-xl bg-cardbgclr border border-borderclr space-y-6">
        <h1 className="text-2xl font-bold text-center text-primary">
          Create Your Account
        </h1>

        <p className="text-sm text-graytext text-center">
          Start generating personalized learning paths in seconds
        </p>

        <Button
          className="w-full"
          onClick={() =>
            signIn("google", {
              callbackUrl: "/dashboard",
            })
          }
        >
          Continue with Google
        </Button>

        <p className="text-xs text-graytext text-center">
          Already have an account?{" "}
          <a href="/auth/signin" className="text-primary underline">
            Sign in
          </a>
        </p>
      </div>
    </div>
  );
}
