import { randomBytes } from "node:crypto";
import { getPrisma } from "@/lib/db";
import { hashPassword, verifyPassword } from "@/lib/password";
import { hashSessionToken, SESSION_TTL_MS } from "@/lib/session";

const normalizeEmail = (email: string) => email.trim().toLowerCase();

export const authService = {
  async signup(email: string, password: string) {
    const prisma = await getPrisma();
    const normalizedEmail = normalizeEmail(email);

    const exists = await prisma.user.findUnique({
      where: { email: normalizedEmail },
    });

    if (exists) {
      throw new Error("An account with this email already exists");
    }

    if (password.length < 8) {
      throw new Error("Password must be at least 8 characters");
    }

    return prisma.user.create({
      data: {
        email: normalizedEmail,
        password: await hashPassword(password),
      },
    });
  },

  async login(email: string, password: string) {
    const prisma = await getPrisma();
    const user = await prisma.user.findUnique({
      where: { email: normalizeEmail(email) },
    });

    if (!user || !(await verifyPassword(password, user.password))) {
      throw new Error("Invalid email or password");
    }

    return user;
  },

  async createSession(userId: string) {
    const prisma = await getPrisma();
    const token = randomBytes(32).toString("base64url");

    await prisma.session.create({
      data: {
        tokenHash: hashSessionToken(token),
        userId,
        expiresAt: new Date(Date.now() + SESSION_TTL_MS),
      },
    });

    return token;
  },
};
