import { getPrisma } from "./db";
import { getSessionUserId } from "./session";
import { users } from "./users";

export async function getCurrentUser() {
  const userId = await getSessionUserId();
  if (!userId) return null;

  const prisma = await getPrisma();

  return prisma.user.findUnique({
    where: { id: userId}
  })
}
