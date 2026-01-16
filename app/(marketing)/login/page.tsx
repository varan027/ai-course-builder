"use client";

import { AuthState, login } from "@/actions/auth";
import Link from "next/link";
import { useActionState } from "react";

const initialState: AuthState = {
  error: null,
};

const page = () => {
  const [state, formAction] = useActionState(login, initialState);
  return (
    <div className="max-w-md mx-auto mt-20 px-4">
      <h1 className="text-2xl font-semibold mb-2">Welcome back</h1>

      <p className="text-sm text-gray-500 mb-6">
        Log in to access your courses.
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
          Login
        </button>
        <p className="text-sm text-gray-600 mt-4 text-center">
          Don&apos;t have an account?{" "}
          <Link href="/signup" className="text-blue-600 hover:underline">
            Sign up
          </Link>
        </p>
      </form>
    </div>
  );
};

export default page;
