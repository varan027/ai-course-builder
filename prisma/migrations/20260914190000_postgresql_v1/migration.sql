-- PostgreSQL V1 foundation.
-- This migration represents the schema changes introduced for the V1 persistence boundary.

CREATE INDEX "Goal_ownerId_idx" ON "Goal"("ownerId");
CREATE INDEX "GoalSkill_goalId_idx" ON "GoalSkill"("goalId");
CREATE INDEX "GoalSkill_skillId_idx" ON "GoalSkill"("skillId");
CREATE INDEX "GoalSkillDependency_prerequisiteGoalSkillId_idx" ON "GoalSkillDependency"("prerequisiteGoalSkillId");
CREATE INDEX "SkillProgress_userId_status_idx" ON "SkillProgress"("userId", "status");
CREATE INDEX "SkillProgress_goalSkillId_idx" ON "SkillProgress"("goalSkillId");

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

CREATE INDEX "Session_userId_expiresAt_idx" ON "Session"("userId", "expiresAt");

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

CREATE INDEX "Evidence_skillProgressId_createdAt_idx" ON "Evidence"("skillProgressId", "createdAt");
