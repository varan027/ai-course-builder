'use server'

import { SESSION_KEY } from "@/lib/session";
import { authService } from "@/services/auth.service";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export type AuthState = {
  error: string | null;
};

export async function Signup(prevState: AuthState, formData: FormData){
  const email = formData.get("email")?.toString();
  const password = formData.get("password")?.toString();

  if(!email || !password){
    return { error: "Missing Fields!"}
  }

  try{
    const user = await authService.signup(email, password);

    const cookie = await cookies()
    cookie.set(SESSION_KEY, user.id, {
    httpOnly: true,
    path: "/"
  })
    
  }catch(err: any){
    return { error: err.message }
  }
  redirect("/dashboard")
}

export async function login(prevState: AuthState, formData: FormData){
  const email = formData.get("email")?.toString();
  const password = formData.get("password")?.toString();

  if(!email || !password){
    return { error: "Missing Fields!"}
  }

  try{
    const user = await authService.login(email, password);
    
    const cookie = await cookies()
    cookie.set(SESSION_KEY, user.id, {
    httpOnly: true,
    path: "/"
  })
    
  }catch(err: any){
    return { error: err.message }
  }
  redirect("/dashboard")
} 