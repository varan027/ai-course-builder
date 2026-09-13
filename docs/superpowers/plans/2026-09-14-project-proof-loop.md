# Project Proof Loop Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Close the mastered-skill project loop with persisted evidence submission and explicit project completion.

**Architecture:** Extend the existing `SkillProgress` record instead of introducing a project-management subsystem. Project state is derived from the existing `projectStartedAt` plus new evidence/completion timestamps, while server actions enforce ownership and state transitions. The project page becomes state-aware and keeps evidence as learner-supplied proof rather than pretending it has been objectively evaluated.

**Tech Stack:** Next.js 16, React 19, TypeScript, Prisma/SQLite, Vitest, Server Actions.

**Spec:** `docs/superpowers/specs/2026-09-13-syllarc-product-foundation-design.md` plus the approved project-proof design from the conversation.

## Global Constraints

- Keep the project proof MVP lightweight; do not add GitHub, deployment, or AI project evaluation integrations.
- Reuse `SkillProgress`; do not create a separate project-management model.
- Evidence submission means learner-provided evidence, not an objectively verified completion claim.
- Preserve authorization boundaries through `goalService.getById(goalId, user.id)` and existing progress-service/repository layers.
- Use TDD: tests first, verify the failing behavior, then implement the minimum production code.

---

### Task 1: Model and project-state contract

**Files:**
- Modify: `prisma/schema.prisma`
- Create: `prisma/migrations/<timestamp>_add_project_evidence/migration.sql`
- Modify: `lib/project-proof.ts`
- Test: `tests/unit/project-proof.test.ts`

**Interfaces:**
- Produces project states `LOCKED | READY | IN_PROGRESS | EVIDENCE_SUBMITTED | COMPLETED`.
- `getProjectProofState(skillStatus, started, evidenceSubmitted, completed)` derives the state deterministically.

- [ ] Write failing state tests for evidence-submitted and completed states, including that completion requires submitted evidence.
- [ ] Run the focused test and verify the new cases fail.
- [ ] Add nullable `projectEvidence`, `projectEvidenceSubmittedAt`, and `projectCompletedAt` fields to `SkillProgress`.
- [ ] Add the SQLite migration.
- [ ] Implement the expanded state helper.
- [ ] Run the focused state test and verify all project-state tests pass.

### Task 2: Persist evidence and completion through repository/service

**Files:**
- Modify: `lib/repositories/progress.repo.ts`
- Modify: `services/progress.service.ts`
- Test: `tests/unit/project-evidence.test.ts`

**Interfaces:**
- `progressRepository.submitProjectEvidence(userId, goalSkillId, evidence)` persists evidence and submission time.
- `progressRepository.completeProject(userId, goalSkillId)` persists completion time only after evidence exists.
- Corresponding `progressService` methods delegate to the repository.

- [ ] Write failing repository/service contract tests for storing evidence and refusing completion without evidence.
- [ ] Run focused tests and verify the new cases fail.
- [ ] Implement repository persistence and service delegation.
- [ ] Run focused tests and verify they pass.

### Task 3: Server actions for evidence submission and completion

**Files:**
- Create: `actions/submitProjectEvidence.ts`
- Create: `actions/completeProject.ts`
- Test: `tests/unit/project-evidence-action.test.ts`

**Interfaces:**
- `submitProjectEvidence(previousState, formData)` validates auth, goal ownership, mastered/started project state, and non-empty evidence; then persists evidence and revalidates the project route.
- `completeProject(previousState, formData)` validates auth, goal ownership, evidence submission, then persists completion and revalidates the project/skill routes.

- [ ] Write failing action tests for valid submission, missing evidence, unstarted project, and completion before evidence.
- [ ] Run the focused action test and verify the new cases fail.
- [ ] Implement both server actions using existing service boundaries.
- [ ] Run focused action tests and verify they pass.

### Task 4: Project workspace UI state machine

**Files:**
- Modify: `app/(course)/courses/[courseId]/projects/[goalSkillId]/page.tsx`
- Modify: `app/(course)/courses/[courseId]/projects/[goalSkillId]/StartProjectForm.tsx`
- Create: `app/(course)/courses/[courseId]/projects/[goalSkillId]/SubmitProjectEvidenceForm.tsx`
- Create: `app/(course)/courses/[courseId]/projects/[goalSkillId]/CompleteProjectForm.tsx`

**Interfaces:**
- READY renders Start Project.
- IN_PROGRESS renders the challenge plus evidence form.
- EVIDENCE_SUBMITTED renders submitted evidence plus completion action.
- COMPLETED renders quiet completion confirmation and links back to the skill.

- [ ] Add UI forms with server-action state handling.
- [ ] Update page data loading to derive state from persisted timestamps/evidence.
- [ ] Render each state without changing the existing premium visual language.
- [ ] Verify the project route build/types locally after the focused tests pass.

### Task 5: Regression verification

**Files:**
- No production files unless verification exposes a regression.

- [ ] Run `npm test` and require the complete suite to pass.
- [ ] Run `npm run build` and require a successful production build.
- [ ] Review the branch diff for accidental scope creep before reporting completion.
