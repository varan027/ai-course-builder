-- PostgreSQL baseline for Syllarc V1.
-- Keep this migration aligned with prisma/schema.prisma so a fresh database
-- can be created with `prisma migrate deploy`.

CREATE TYPE "GoalStatus" AS ENUM ('CREATING', 'READY');
CREATE TYPE "SkillStatus" AS ENUM ('NOT_STARTED', 'EXPLORING', 'PRACTICING', 'APPLYING', 'MASTERED');

CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "User_pkey" PRIMARY KEY ("id"),
    CONSTRAINT "User_email_key" UNIQUE ("email")
);

CREATE TABLE "Goal" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "estimatedWeeks" INTEGER NOT NULL,
    "status" "GoalStatus" NOT NULL DEFAULT 'CREATING',
    "ownerId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "Goal_pkey" PRIMARY KEY ("id"),
    CONSTRAINT "Goal_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

CREATE TABLE "Skill" (
    "id" TEXT NOT NULL,
    "skillKey" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "Skill_pkey" PRIMARY KEY ("id"),
    CONSTRAINT "Skill_skillKey_key" UNIQUE ("skillKey")
);

CREATE TABLE "GoalSkill" (
    "id" TEXT NOT NULL,
    "goalId" TEXT NOT NULL,
    "skillId" TEXT NOT NULL,
    "position" INTEGER NOT NULL,
    "description" TEXT NOT NULL,
    "whyImportant" TEXT NOT NULL,
    "milestone" TEXT NOT NULL,
    "projectChallenge" TEXT NOT NULL,
    "lessonOverview" TEXT,
    "lessonKeyIdeas" TEXT,
    "lessonContent" TEXT,
    "lessonPractice" TEXT,
    CONSTRAINT "GoalSkill_pkey" PRIMARY KEY ("id"),
    CONSTRAINT "GoalSkill_goalId_fkey" FOREIGN KEY ("goalId") REFERENCES "Goal"("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "GoalSkill_skillId_fkey" FOREIGN KEY ("skillId") REFERENCES "Skill"("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "GoalSkill_goalId_skillId_key" UNIQUE ("goalId", "skillId"),
    CONSTRAINT "GoalSkill_goalId_position_key" UNIQUE ("goalId", "position")
);

CREATE TABLE "GoalSkillDependency" (
    "id" TEXT NOT NULL,
    "goalSkillId" TEXT NOT NULL,
    "prerequisiteGoalSkillId" TEXT NOT NULL,
    CONSTRAINT "GoalSkillDependency_pkey" PRIMARY KEY ("id"),
    CONSTRAINT "GoalSkillDependency_goalSkillId_fkey" FOREIGN KEY ("goalSkillId") REFERENCES "GoalSkill"("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "GoalSkillDependency_prerequisiteGoalSkillId_fkey" FOREIGN KEY ("prerequisiteGoalSkillId") REFERENCES "GoalSkill"("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "GoalSkillDependency_goalSkillId_prerequisiteGoalSkillId_key" UNIQUE ("goalSkillId", "prerequisiteGoalSkillId")
);

CREATE TABLE "SkillProgress" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "goalSkillId" TEXT NOT NULL,
    "status" "SkillStatus" NOT NULL DEFAULT 'NOT_STARTED',
    "projectStartedAt" TIMESTAMP(3),
    "completedAt" TIMESTAMP(3),
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "SkillProgress_pkey" PRIMARY KEY ("id"),
    CONSTRAINT "SkillProgress_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "SkillProgress_goalSkillId_fkey" FOREIGN KEY ("goalSkillId") REFERENCES "GoalSkill"("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "SkillProgress_userId_goalSkillId_key" UNIQUE ("userId", "goalSkillId")
);

CREATE TABLE "Session" (
    "id" TEXT NOT NULL,
    "tokenHash" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Session_pkey" PRIMARY KEY ("id"),
    CONSTRAINT "Session_tokenHash_key" UNIQUE ("tokenHash"),
    CONSTRAINT "Session_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE "Evidence" (
    "id" TEXT NOT NULL,
    "skillProgressId" TEXT NOT NULL,
    "response" TEXT NOT NULL,
    "passed" BOOLEAN NOT NULL,
    "score" INTEGER NOT NULL,
    "feedback" TEXT NOT NULL,
    "criteriaResults" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Evidence_pkey" PRIMARY KEY ("id"),
    CONSTRAINT "Evidence_skillProgressId_fkey" FOREIGN KEY ("skillProgressId") REFERENCES "SkillProgress"("id") ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE INDEX "Goal_ownerId_idx" ON "Goal"("ownerId");
CREATE INDEX "GoalSkill_goalId_idx" ON "GoalSkill"("goalId");
CREATE INDEX "GoalSkill_skillId_idx" ON "GoalSkill"("skillId");
CREATE INDEX "GoalSkillDependency_prerequisiteGoalSkillId_idx" ON "GoalSkillDependency"("prerequisiteGoalSkillId");
CREATE INDEX "SkillProgress_userId_status_idx" ON "SkillProgress"("userId", "status");
CREATE INDEX "SkillProgress_goalSkillId_idx" ON "SkillProgress"("goalSkillId");
CREATE INDEX "Session_userId_expiresAt_idx" ON "Session"("userId", "expiresAt");
CREATE INDEX "Evidence_skillProgressId_createdAt_idx" ON "Evidence"("skillProgressId", "createdAt");
