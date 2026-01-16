"use client";

import { AuthState, Signup } from "@/actions/auth";
import Link from "next/link";
import { useActionState } from "react";

const initialState: AuthState = {
  error: null,
};

const page = () => {
  const [state, formAction] = useActionState(Signup, initialState);
  return (
    <div className="max-w-md mx-auto mt-20 px-4">
      <h1 className="text-2xl font-semibold mb-2">Create an account</h1>

      <p className="text-sm text-gray-500 mb-6">
        Sign up to generate AI-powered learning paths.
      </p>

      <form action={formAction} className="space-y-4">
        <input
          name="email"
          type="email"
          placeholder="Email address"
          required
          className="w-full border rounded-md px-3 py-2 text-sm"
        />

        <input
          name="password"
          type="password"
          placeholder="Password"
          required
          className="w-full border rounded-md px-3 py-2 text-sm"
        />

        {state?.error && <p className="text-sm text-red-600">{state.error}</p>}

        <button className="w-full text-black bg-white py-2 rounded-md text-sm">
          Sign up
        </button>
        <p className="text-sm text-gray-600 mt-4 text-center">
          Already have an account?{" "}
          <Link href="/login" className="text-blue-600 hover:underline">
            Log in
          </Link>
        </p>
      </form>
    </div>
  );
};

export default page;
