import { cookies } from "next/headers";

export const SESSION_KEY = "session_user";


export async function getSessionUserId(){
  const cookie = await cookies()
  return cookie.get(SESSION_KEY)?.value
}
