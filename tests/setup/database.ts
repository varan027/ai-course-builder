import { getPrisma } from "@/lib/db";

export async function resetDatabase() {
  const prisma = await getPrisma();

  await prisma.skillProgress.deleteMany();
  await prisma.goalSkillDependency.deleteMany();
  await prisma.goalSkill.deleteMany();
  await prisma.goal.deleteMany();
  await prisma.skill.deleteMany();
  await prisma.user.deleteMany();
}