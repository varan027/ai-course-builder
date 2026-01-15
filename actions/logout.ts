'use server'
import { SESSION_KEY } from "@/lib/session";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export async function logout(){
  const cookie = await cookies();
  cookie.delete(SESSION_KEY);
  redirect("/login")
}