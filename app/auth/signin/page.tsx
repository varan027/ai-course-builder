"use client";

import { signIn } from "next-auth/react";
import { useSearchParams } from "next/navigation";
import Button from "@/components/ui/Button";

export default function SignInPage() {
  const params = useSearchParams();
  const callbackUrl = params.get("callbackUrl") || "/dashboard";

  return (
    <div className="min-h-screen flex items-center justify-center bg-black">
      <div className="w-full max-w-md p-6 rounded-xl bg-cardbgclr border border-borderclr space-y-6">
        <h1 className="text-2xl font-bold text-center text-primary">
          Welcome Back
        </h1>

        <p className="text-sm text-graytext text-center">
          Sign in to continue building your AI-powered courses
        </p>

        <Button
          className="w-full"
          onClick={() =>
            signIn("google", {
              callbackUrl,
            })
          }
        >
          Sign in with Google
        </Button>

        <p className="text-xs text-graytext text-center">
          Don’t have an account?{" "}
          <a href="/auth/signup" className="text-primary underline">
            Sign up
          </a>
        </p>
      </div>
    </div>
  );
}
