import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { getServerSession, type Session } from "next-auth";

export type AuthUser = Session["user"];

export async function getAuthUser(): Promise<AuthUser> {
  const session = await getServerSession(authOptions);

  if (!session || !session.user || !session.user.id) {
    throw new Error("Unauthorized");
  }

  return session.user;
}