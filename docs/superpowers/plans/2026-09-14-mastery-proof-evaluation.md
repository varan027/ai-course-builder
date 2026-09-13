# AI Mastery Proof Evaluation Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the current keyword/length mastery gate with stored, skill-specific mastery proofs evaluated by AI, where passing evidence—not a button—causes the `APPLYING → MASTERED` transition.

**Architecture:** Extend the existing `GoalSkill` record with nullable structured proof fields stored as JSON strings because the app uses SQLite. Generate proofs with the existing AI service, evaluate learner submissions through a dedicated AI evaluator method returning validated structured output, and let the server action/progress service own the final state transition. The learner UI presents a real evidence submission action and never exposes hidden rubric criteria or a fake “mark mastered” control.

**Tech Stack:** Next.js 16 App Router, React 19, TypeScript, Zod, Prisma/SQLite, Google Generative AI, Vitest.

**Spec:** `docs/superpowers/specs/2026-09-13-mastery-proof-evaluation-design.md`

## Global Constraints

- Evidence must come before `MASTERED`.
- No user-facing action may merely change button text or UI state without performing the corresponding domain action.
- No keyword matching or minimum-answer-length mastery gate.
- Equivalent valid answers must be accepted when they demonstrate the defined capabilities.
- AI evaluates evidence against stored skill-specific capabilities and criteria.
- AI must not directly mutate progress state.
- Keep existing `SkillStatus` enum; evidence is a checkpoint, not a new database status.
- Preserve legacy skills without mastery proofs.
- No attempt-history table, code sandbox, project completion model, or dashboard redesign.
- Follow TDD: write and run a failing test before production implementation for each behavior.

## File Map

- Modify `lib/ai/schema.ts` — add `MasteryProofSchema` and `MasteryEvaluationSchema`.
- Modify `lib/ai/prompts.ts` — require a structured mastery proof during roadmap generation and add the evaluator prompt.
- Modify `services/ai.service.ts` — add proof evaluation through the existing isolated Gemini service.
- Modify `prisma/schema.prisma` — add nullable mastery proof JSON-string fields to `GoalSkill`.
- Create `prisma/migrations/20260914_add_mastery_proof/migration.sql` — add nullable proof columns.
- Modify `lib/repositories/goal.repo.ts` — persist generated proof fields.
- Modify `lib/mastery-proof.ts` — replace keyword gate with proof/evaluation helpers and safe result handling.
- Modify `actions/advancceSkill.ts` — submit evidence, evaluate it, and only then advance to `MASTERED`.
- Modify the relevant skill page/form component — render evidence checkpoint and real submission behavior; remove fake mastery controls.
- Create focused unit tests for schema, AI evaluation, application gate, legacy compatibility, and UI action semantics.

---

## Task 1: Lock the Mastery Proof and Evaluation Contracts

**Files:** `tests/unit/mastery-proof.test.ts`, new schema tests as needed.

- [ ] Write failing tests for five proof types: `CONCEPTUAL`, `TECHNICAL`, `ANALYTICAL`, `PRACTICAL`, `CREATIVE`.
- [ ] Write failing tests requiring a proof task, at least one capability, and at least one evaluation criterion.
- [ ] Write failing tests for evaluation results containing `passed`, per-capability `demonstrated`, `feedback`, and `retryGuidance`.
- [ ] Run focused tests and verify they fail for the intended missing contract.
- [ ] Implement the minimal Zod schemas and pure types.
- [ ] Run focused tests and verify green.
- [ ] Commit: `test: define mastery proof contracts`.

## Task 2: Generate Skill-Specific Proofs

**Files:** `tests/unit/ai-service.test.ts`, `lib/ai/schema.ts`, `lib/ai/prompts.ts`, `services/ai.service.ts`.

- [ ] Update the AI fixture with a complete `masteryProof` and add a failing assertion that new generated skills contain it.
- [ ] Run the focused AI test and verify it fails against the current roadmap schema/prompt.
- [ ] Extend `SkillSchema` so new AI output requires a mastery proof while keeping a documented legacy compatibility path for persisted old skills.
- [ ] Update `ROADMAP_PROMPT` so each skill produces a concrete proof task, proof type, observable capabilities, and criteria allowing multiple valid approaches.
- [ ] Add an isolated `evaluateMasteryProof` AI service method that receives skill/lesson/proof context and learner evidence, calls Gemini, strips JSON fences, validates the response, and returns `MasteryEvaluation`.
- [ ] Add focused tests for evaluator parsing, malformed output, and non-exact wording acceptance through structured mocked evaluator results.
- [ ] Run the focused AI tests and verify green.
- [ ] Commit: `feat: generate and evaluate skill mastery proofs`.

## Task 3: Persist Proof Data

**Files:** `tests/unit/goal-repo.test.ts` or closest existing repository test, `prisma/schema.prisma`, migration, `lib/repositories/goal.repo.ts`.

- [ ] Write failing repository coverage proving generated proof fields are stored and can be read back.
- [ ] Run the focused repository test and verify failure.
- [ ] Add nullable `masteryProofTask`, `masteryProofType`, `masteryProofCapabilities`, and `masteryProofCriteria` fields to `GoalSkill`.
- [ ] Add the migration with nullable columns.
- [ ] Store proof values as JSON strings, preserving null for legacy skills.
- [ ] Run Prisma generation/migration and the focused repository test.
- [ ] Commit: `feat: persist mastery proof definitions`.

## Task 4: Replace the Weak Mastery Gate

**Files:** `tests/unit/mastery-gate.test.ts`, `tests/unit/advance-skill-mastery.test.ts`, `lib/mastery-proof.ts`, `actions/advancceSkill.ts`.

- [ ] Write failing tests proving short answers cannot pass merely because of length/keywords.
- [ ] Write failing tests proving a failed evaluator result leaves the skill at `APPLYING`.
- [ ] Write failing tests proving a valid passed evaluation is the only path from `APPLYING` to `MASTERED`.
- [ ] Write failing tests proving missing proof data fails safely instead of silently granting mastery.
- [ ] Run focused tests and verify failures for the intended old behavior.
- [ ] Remove keyword matching and the old boolean `evaluateMasteryProof` gate.
- [ ] Make the action load the stored proof, submit the learner evidence to the AI evaluator, validate the structured result, and only call `progressService.advanceSkill` when the evaluator passes.
- [ ] Keep prerequisite enforcement and authorization unchanged.
- [ ] Return actionable retry feedback without exposing hidden criteria.
- [ ] Run focused tests and verify green.
- [ ] Commit: `feat: gate mastery on evaluated evidence`.

## Task 5: Replace the Fake Mastery UI With Evidence Submission

**Files:** existing skill page and mastery form component, focused UI/action tests.

- [ ] Write a failing regression test/assertion that no `Mark as mastered` action exists.
- [ ] Write a failing test for an `APPLYING` skill showing a learner-facing proof task and a real `Submit evidence` action.
- [ ] Run focused UI tests and verify failure.
- [ ] Render the stored proof task when available.
- [ ] Submit the learner's evidence through the existing server action; show loading/submission state tied to the actual action, not a fake text toggle.
- [ ] On failure, render evaluator feedback and retry guidance while remaining in `APPLYING`.
- [ ] On success, render the mastered state and a meaningful next action toward the project/build stage.
- [ ] Preserve a safe legacy fallback for old skills without a stored proof; do not expose a fake mastery button.
- [ ] Run focused UI tests and the full test suite.
- [ ] Commit: `feat: make mastery evidence a real learner action`.

## Task 6: Verify Integration and Runtime

- [ ] Pull/update the branch locally and run `npx prisma generate` and the new migration against the development database.
- [ ] Run `npm test` and confirm all tests pass.
- [ ] Run `npm run lint`; distinguish the known pre-existing lint errors from any new errors.
- [ ] Run `npm run build` and confirm production compilation succeeds.
- [ ] Run the app and manually verify: APPLYING → evidence task → submit → retry on failed evaluation → submit again → MASTERED on pass; no fake mastery button appears.
- [ ] Verify an existing legacy course without proof still loads.
- [ ] Commit any final evidence-based fixes only after a fresh failing test where behavior changes.

## Final Verification

- [ ] `npm test` passes.
- [ ] `npm run build` passes.
- [ ] `npm run lint` introduces no new errors beyond the documented baseline.
- [ ] Mastery is impossible without passing evidence.
- [ ] Evidence is completed before mastery.
- [ ] No button exists whose only effect is changing its label/state.
- [ ] Different valid answers can pass through evaluator criteria rather than exact matching.
- [ ] Failed evidence gives a useful retry path.
- [ ] AI cannot directly mutate progress.
- [ ] Legacy skills remain readable.
