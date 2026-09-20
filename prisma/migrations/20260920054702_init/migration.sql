-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "Goal" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "estimatedWeeks" INTEGER NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'CREATING',
    "ownerId" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Goal_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Skill" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "skillKey" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "GoalSkill" (
    "id" TEXT NOT NULL PRIMARY KEY,
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
    "masteryCriteria" TEXT,
    CONSTRAINT "GoalSkill_goalId_fkey" FOREIGN KEY ("goalId") REFERENCES "Goal" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "GoalSkill_skillId_fkey" FOREIGN KEY ("skillId") REFERENCES "Skill" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "GoalSkillDependency" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "goalSkillId" TEXT NOT NULL,
    "prerequisiteGoalSkillId" TEXT NOT NULL,
    CONSTRAINT "GoalSkillDependency_goalSkillId_fkey" FOREIGN KEY ("goalSkillId") REFERENCES "GoalSkill" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "GoalSkillDependency_prerequisiteGoalSkillId_fkey" FOREIGN KEY ("prerequisiteGoalSkillId") REFERENCES "GoalSkill" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "SkillProgress" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "goalSkillId" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'NOT_STARTED',
    "projectStartedAt" DATETIME,
    "completedAt" DATETIME,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "SkillProgress_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "SkillProgress_goalSkillId_fkey" FOREIGN KEY ("goalSkillId") REFERENCES "GoalSkill" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Session" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "tokenHash" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "expiresAt" DATETIME NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Session_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Evidence" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "skillProgressId" TEXT NOT NULL,
    "response" TEXT NOT NULL,
    "passed" BOOLEAN NOT NULL,
    "score" INTEGER NOT NULL,
    "feedback" TEXT NOT NULL,
    "criteriaResults" JSONB NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Evidence_skillProgressId_fkey" FOREIGN KEY ("skillProgressId") REFERENCES "SkillProgress" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE INDEX "Goal_ownerId_idx" ON "Goal"("ownerId");

-- CreateIndex
CREATE UNIQUE INDEX "Skill_skillKey_key" ON "Skill"("skillKey");

-- CreateIndex
CREATE INDEX "GoalSkill_goalId_idx" ON "GoalSkill"("goalId");

-- CreateIndex
CREATE INDEX "GoalSkill_skillId_idx" ON "GoalSkill"("skillId");

-- CreateIndex
CREATE UNIQUE INDEX "GoalSkill_goalId_skillId_key" ON "GoalSkill"("goalId", "skillId");

-- CreateIndex
CREATE UNIQUE INDEX "GoalSkill_goalId_position_key" ON "GoalSkill"("goalId", "position");

-- CreateIndex
CREATE INDEX "GoalSkillDependency_prerequisiteGoalSkillId_idx" ON "GoalSkillDependency"("prerequisiteGoalSkillId");

-- CreateIndex
CREATE UNIQUE INDEX "GoalSkillDependency_goalSkillId_prerequisiteGoalSkillId_key" ON "GoalSkillDependency"("goalSkillId", "prerequisiteGoalSkillId");

-- CreateIndex
CREATE INDEX "SkillProgress_userId_status_idx" ON "SkillProgress"("userId", "status");

-- CreateIndex
CREATE INDEX "SkillProgress_goalSkillId_idx" ON "SkillProgress"("goalSkillId");

-- CreateIndex
CREATE UNIQUE INDEX "SkillProgress_userId_goalSkillId_key" ON "SkillProgress"("userId", "goalSkillId");

-- CreateIndex
CREATE UNIQUE INDEX "Session_tokenHash_key" ON "Session"("tokenHash");

-- CreateIndex
CREATE INDEX "Session_userId_expiresAt_idx" ON "Session"("userId", "expiresAt");

-- CreateIndex
CREATE INDEX "Evidence_skillProgressId_createdAt_idx" ON "Evidence"("skillProgressId", "createdAt");
