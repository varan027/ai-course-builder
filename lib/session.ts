import { createHash } from "node:crypto";
import { cookies } from "next/headers";
import { getPrisma } from "@/lib/db";

export const SESSION_KEY = "session_token";
export const SESSION_TTL_MS = 1000 * 60 * 60 * 24 * 7;

function hashToken(token: string) {
  return createHash("sha256").update(token).digest("hex");
}

export async function getSessionUserId() {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_KEY)?.value;

  if (!token) return null;

  const prisma = await getPrisma();
  const session = await prisma.session.findUnique({
    where: { tokenHash: hashToken(token) },
    select: { userId: true, expiresAt: true },
  });

  if (!session) return null;

  if (session.expiresAt <= new Date()) {
    await prisma.session.deleteMany({
      where: { tokenHash: hashToken(token) },
    });
    return null;
  }

  return session.userId;
}

export function hashSessionToken(token: string) {
  return hashToken(token);
}
