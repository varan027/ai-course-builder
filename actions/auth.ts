'use server';

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { authService } from "@/services/auth.service";
import { SESSION_KEY, SESSION_TTL_MS } from "@/lib/session";

export type AuthState = {
  error: string | null;
};

async function setSessionCookie(userId: string) {
  const token = await authService.createSession(userId);
  const cookieStore = await cookies();

  cookieStore.set(SESSION_KEY, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: Math.floor(SESSION_TTL_MS / 1000),
  });
}

export async function Signup(
  _prevState: AuthState,
  formData: FormData,
): Promise<AuthState> {
  const email = formData.get("email")?.toString() ?? "";
  const password = formData.get("password")?.toString() ?? "";

  if (!email || !password) {
    return { error: "Email and password are required" };
  }

  try {
    const user = await authService.signup(email, password);
    await setSessionCookie(user.id);
  } catch (error) {
    return {
      error: error instanceof Error ? error.message : "Unable to create account",
    };
  }

  redirect("/dashboard");
}

export async function login(
  _prevState: AuthState,
  formData: FormData,
): Promise<AuthState> {
  const email = formData.get("email")?.toString() ?? "";
  const password = formData.get("password")?.toString() ?? "";

  if (!email || !password) {
    return { error: "Email and password are required" };
  }

  try {
    const user = await authService.login(email, password);
    await setSessionCookie(user.id);
  } catch (error) {
    return {
      error: error instanceof Error ? error.message : "Unable to sign in",
    };
  }

  redirect("/dashboard");
}
