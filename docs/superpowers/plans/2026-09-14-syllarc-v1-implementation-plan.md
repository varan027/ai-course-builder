# Syllarc V1 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Turn the existing Syllarc prototype into a reliable V1 learning product with a complete Goal → Learn → Practice → Prove → Mastery → Project → Next Skill loop.

**Architecture:** Keep Syllarc as a modular Next.js monolith. UI calls server actions; server actions authenticate/validate and call domain services; services own business rules; repositories own persistence; the AI service isolates Gemini and validates structured output before persistence.

**Tech Stack:** Next.js 16, React 19, TypeScript 5, Prisma 6, PostgreSQL, Gemini SDK, Zod 4, Vitest 4, Tailwind 4, Framer Motion, GitHub Actions.

**Spec:** `docs/superpowers/specs/2026-09-14-syllarc-v1-design.md`

## Global Constraints

- Syllarc remains a modular monolith.
- Business rules stay centralized and testable.
- Treat AI as an untrusted external dependency.
- Validate at boundaries.
- Enforce security on the server.
- Preserve useful learning evidence rather than only percentages.
- Improve existing boundaries when directly required by the V1 goal, but avoid unrelated refactoring.
- Optimize for a product the learner can actually use and the developer can fully explain.
- PostgreSQL is the intended production database.
- V1 does not add AI tutor/chat, vector database/RAG infrastructure, knowledge-graph infrastructure, spaced repetition, automated code execution, billing, social/team features, mobile application, or distributed infrastructure.

---

## File Map

The implementation should follow the repository's existing organization rather than introducing a new framework or service structure.

- Modify `prisma/schema.prisma`: PostgreSQL datasource, session model, evidence model, and fields needed for practice/mastery criteria.
- Create/modify Prisma migration files under `prisma/migrations/`: reproducible PostgreSQL schema history.
- Modify `lib/session.ts`: secure session lookup and expiration handling.
- Modify `lib/auth.ts`: authenticated-user lookup using the hardened session layer.
- Modify `actions/auth.ts`: secure session creation during login/signup.
- Create `services/auth.service.ts`: session creation/revocation rules if needed to keep auth business logic out of actions.
- Modify `services/progress.service.ts`: canonical progression and mastery rules.
- Create `services/mastery.service.ts`: evidence submission and structured mastery evaluation orchestration.
- Modify `services/goal.service.ts`: preserve validated AI roadmap creation while exposing the new learning data cleanly.
- Modify `lib/ai/*` and/or existing AI service files: structured output, validation, prompt versioning, and controlled retry/failure behavior.
- Modify `actions/advancceSkill.ts`: keep the existing action as a thin authenticated entry point; move mastery/evidence decisions to services.
- Create an evidence server action under `actions/` following existing naming conventions: authenticate, validate, call `mastery.service`, and revalidate.
- Modify `services/progress.repo.ts`: evidence persistence and safe project-start behavior.
- Modify `services/goalRepository.ts`: preserve owner-scoped queries and aggregate creation.
- Modify relevant skill/dashboard components under `components/` and route files under `app/`: present the Learn → Practice → Prove → Project journey and next action.
- Create `tests/unit/*` for state, evidence, validation, and AI contracts.
- Create integration tests where database behavior cannot be meaningfully covered by pure unit tests.
- Create `.github/workflows/ci.yml`: lint, type-check, test, and production build checks.
- Modify `README.md` and environment/setup documentation: make PostgreSQL and V1 behavior match the actual implementation.

---

## Task 1: Establish a verified V1 baseline

**Files:**
- Create: `.superpowers/sdd/2026-09-14-syllarc-v1-implementation-plan/progress.md` in the execution workspace, not the repository.
- Inspect: `package.json`, `prisma/schema.prisma`, `actions/`, `services/`, `lib/`, `app/`, `tests/`.

**Interfaces:**
- Consumes: the approved V1 spec.
- Produces: a verified starting point and a test command set for every later task.

- [ ] **Step 1: Confirm the canonical branch**

Run:

```bash
git branch --show-current
git status --short
git log -5 --oneline
```

Expected: the implementation starts from `product-upgrade`; no unrelated uncommitted changes are overwritten.

- [ ] **Step 2: Run the existing test suite before changes**

Run:

```bash
npm test -- --run
```

Expected: record the current pass/fail result in the execution ledger. Existing failures must be distinguished from regressions introduced by V1 work.

- [ ] **Step 3: Run the current production build**

Run:

```bash
npm run build
```

Expected: record whether the current branch builds before implementation.

- [ ] **Step 4: Commit only if baseline documentation/setup requires a change**

Do not modify application code in this task. If no baseline change is needed, make no commit.

---

## Task 2: Make PostgreSQL the reproducible database foundation

**Files:**
- Modify: `prisma/schema.prisma`
- Create: `prisma/migrations/<timestamp>_postgresql_v1/migration.sql`
- Inspect/modify: `.env.example` or the repository's existing environment documentation.
- Test: database/repository integration tests under `tests/integration/` where the project already has a database-test pattern.

**Interfaces:**
- Consumes: current Prisma models and repository APIs.
- Produces: a PostgreSQL-backed Prisma schema with reproducible migrations and unchanged domain model semantics except for explicitly approved V1 additions.

- [ ] **Step 1: Write a database smoke test**

The test must connect through the application's Prisma client and prove that a minimal user/goal aggregate can be created and read back with the expected owner relationship.

- [ ] **Step 2: Run the smoke test and confirm the environment failure/success state**

Run the focused integration test. If PostgreSQL test infrastructure is not yet configured, document the exact missing environment requirement rather than silently falling back to SQLite.

- [ ] **Step 3: Change the Prisma datasource to PostgreSQL**

The datasource must become:

```prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}
```

Keep the existing model names and relations unless a later V1 task explicitly changes them.

- [ ] **Step 4: Add the V1 persistence models/fields required by later tasks**

Add the session and evidence structures defined in Tasks 3 and 4, using explicit foreign keys and indexes for owner-scoped lookups. Do not add unrelated analytics or future portfolio models.

- [ ] **Step 5: Generate and inspect the migration**

Run:

```bash
npx prisma migrate dev --name postgresql_v1
```

Then inspect the generated SQL and confirm it creates only the schema changes represented in `schema.prisma`.

- [ ] **Step 6: Re-run the smoke test**

Expected: PASS against PostgreSQL.

- [ ] **Step 7: Commit**

```bash
git add prisma .env.example README.md tests
git commit -m "chore: standardize PostgreSQL persistence"
```

---

## Task 3: Harden authentication and authorization

**Files:**
- Modify: `prisma/schema.prisma`
- Modify: `lib/session.ts`
- Modify: `lib/auth.ts`
- Modify: `actions/auth.ts`
- Create: `services/auth.service.ts` if the session rules need a service boundary.
- Test: `tests/unit/auth*.test.ts` and integration tests for protected ownership behavior.

**Interfaces:**
- Consumes: `User` records and the PostgreSQL database from Task 2.
- Produces: authenticated sessions with expiration and secure cookies; server-side owner checks usable by every protected action/service.

- [ ] **Step 1: Write tests for session and ownership behavior**

Cover these cases explicitly:

```text
valid session → authenticated user
expired session → unauthenticated
missing session → unauthenticated
user A requesting user B's goal → rejected
user A requesting user A's goal → allowed
```

- [ ] **Step 2: Run the focused tests and verify they fail for the new cases**

Run:

```bash
npm test -- --run tests/unit/auth*.test.ts
```

Expected: the new security expectations fail against the prototype session behavior.

- [ ] **Step 3: Implement database-backed sessions**

Use an explicit session record with:

```text
id
tokenHash
userId
expiresAt
createdAt
```

Store only a secure opaque token in the cookie; store its hash in the database. Session lookup must reject expired sessions.

- [ ] **Step 4: Harden the cookie**

Set the session cookie as `httpOnly`, `sameSite=lax`, `secure` in production, and with an explicit expiration aligned to the session record.

- [ ] **Step 5: Keep authorization server-side**

All protected goal/progress/evidence/project operations must first identify the authenticated user and then query the target through an owner-scoped repository/service operation.

- [ ] **Step 6: Run the focused tests**

Expected: PASS.

- [ ] **Step 7: Run the full test suite**

```bash
npm test -- --run
```

Expected: PASS with no regression in existing auth flows.

- [ ] **Step 8: Commit**

```bash
git add prisma lib actions services tests
git commit -m "feat: harden authentication and authorization"
```

---

## Task 4: Build evidence-based mastery

**Files:**
- Modify: `prisma/schema.prisma`
- Create: `services/mastery.service.ts`
- Modify: `services/progress.service.ts`
- Modify: `services/progress.repo.ts`
- Create: `actions/submitEvidence.ts` following existing server-action conventions.
- Create: `tests/unit/mastery.service.test.ts`
- Modify: `tests/unit/progress-state.test.ts` or the existing progress-state tests.

**Interfaces:**
- Consumes: `GoalSkill`, `SkillProgress`, authenticated user identity, explicit practice/mastery criteria, and the AI evaluation interface from Task 5.
- Produces: retained evidence attempts, structured pass/retry decisions, and mastery transitions that cannot bypass the state machine.

- [ ] **Step 1: Define the evidence data contract**

Use a model representing an individual learner attempt with at least:

```text
id
skillProgressId
response
passed
score
feedback
criteriaResults
createdAt
```

`criteriaResults` may use PostgreSQL JSON because its shape is evaluator output, but the application must validate the evaluator response before storing it.

- [ ] **Step 2: Write failing domain tests**

Cover:

```text
APPLYING + failed evidence → remains APPLYING
APPLYING + passed evidence → MASTERED
non-APPLYING + evidence submission → rejected
MASTERED + evidence submission → no backward transition
project start → never creates MASTERED
missing prerequisite → cannot advance
```

- [ ] **Step 3: Run the tests and verify failure**

```bash
npm test -- --run tests/unit/mastery.service.test.ts tests/unit/progress-state.test.ts
```

Expected: FAIL on the new mastery/evidence expectations.

- [ ] **Step 4: Implement the evidence model and repository methods**

Add owner-safe lookup through the related goal/skill progress relationship. Never accept an arbitrary `userId` as proof of ownership without checking the target resource.

- [ ] **Step 5: Implement `masteryService.submitEvidence()`**

The service must:

1. load the user's skill progress;
2. verify the current state is `APPLYING`;
3. load the skill's explicit mastery criteria;
4. call the evaluator interface;
5. validate the evaluator result;
6. save the evidence attempt;
7. transition to `MASTERED` only when the evaluator passes;
8. return structured feedback for retry or success.

- [ ] **Step 6: Fix project-start invariants**

`startProject` must require an existing `MASTERED` progress record and must never upsert a missing record into `MASTERED`.

- [ ] **Step 7: Run focused tests**

Expected: PASS.

- [ ] **Step 8: Commit**

```bash
git add prisma services actions tests
git commit -m "feat: add evidence-based mastery"
```

---

## Task 5: Make AI output structured and reliable

**Files:**
- Modify: existing AI service files under `lib/` / `services/` identified during implementation.
- Modify: roadmap Zod schemas.
- Create: an explicit evaluator schema/module if the existing AI module does not have a suitable boundary.
- Test: `tests/unit/ai*.test.ts`, including malformed-output cases.

**Interfaces:**
- Consumes: learner goal, skill objectives, practice response, and explicit mastery criteria.
- Produces: validated roadmap/evaluation objects with stable application-level types; provider-specific Gemini details remain behind the AI boundary.

- [ ] **Step 1: Write failing parser/validation tests**

Cover:

```text
valid roadmap → accepted
malformed roadmap → rejected
valid mastery evaluation → accepted
missing passed field → rejected
invalid score → rejected
invalid criteria result → rejected
```

- [ ] **Step 2: Run focused tests**

```bash
npm test -- --run tests/unit/ai*.test.ts
```

Expected: FAIL for the new contracts.

- [ ] **Step 3: Define explicit schemas**

Roadmap output must include enough information to support the V1 flow, including a practice prompt and mastery criteria for each skill. Evaluation output must include:

```text
passed: boolean
score: number
strengths: string[]
gaps: string[]
feedback: string
criteriaResults: structured results
```

The score must be bounded by the schema.

- [ ] **Step 4: Isolate Gemini calls behind the AI service**

Application code must call an application-level function/interface rather than constructing the Gemini client inside UI/actions/domain logic.

- [ ] **Step 5: Add controlled retry**

When Gemini returns syntactically unusable structured output, retry once with a correction instruction. If the second attempt is invalid, return a typed application error. Do not persist the invalid response.

- [ ] **Step 6: Add prompt identification**

Give roadmap and mastery prompts a clear version identifier in source so output changes can be traced to a prompt version.

- [ ] **Step 7: Run focused and full tests**

```bash
npm test -- --run tests/unit/ai*.test.ts
npm test -- --run
```

Expected: PASS.

- [ ] **Step 8: Commit**

```bash
git add lib services tests
 git commit -m "feat: harden structured AI workflows"
```

---

## Task 6: Connect practice and mastery to server actions

**Files:**
- Modify: `actions/advancceSkill.ts`
- Create/modify: `actions/submitEvidence.ts`
- Modify: `actions/startProject.ts`
- Modify: relevant schemas under `actions/`.
- Test: server-action tests under `tests/unit/` or existing action-test locations.

**Interfaces:**
- Consumes: authenticated user/session, Zod input schemas, progress service, mastery service, and goal ownership rules.
- Produces: thin server entry points with safe user-facing failures and correct revalidation.

- [ ] **Step 1: Write failing action tests**

Cover unauthenticated access, wrong-owner access, invalid evidence input, prerequisite failures, mastery retry, mastery success, and project-start-before-mastery.

- [ ] **Step 2: Run focused tests and confirm failure**

```bash
npm test -- --run tests/unit/actions*.test.ts
```

- [ ] **Step 3: Refactor `advanceSkill` into a thin action**

The action should authenticate, load the owned goal/skill, validate input, call the service, and return a safe result. It should not implement the mastery keyword matcher or duplicate state-machine rules.

- [ ] **Step 4: Implement `submitEvidence` action**

Validate the submitted response with Zod, authenticate the user, call `masteryService.submitEvidence`, and revalidate the relevant skill/dashboard paths.

- [ ] **Step 5: Harden `startProject`**

Require a real `MASTERED` state from the owned progress record. Return a safe application error when mastery is absent.

- [ ] **Step 6: Run focused and full tests**

Expected: PASS.

- [ ] **Step 7: Commit**

```bash
git add actions tests
 git commit -m "feat: connect learning evidence actions"
```

---

## Task 7: Upgrade the learner experience around the real domain flow

**Files:**
- Modify: relevant dashboard route files under `app/(dashboard)/`.
- Modify: relevant course/skill route files under `app/(course)/`.
- Modify: relevant components under `components/`.
- Test: component/route tests where existing test conventions support them.

**Interfaces:**
- Consumes: validated progress/evidence/project state and the next-action decision from server-side domain data.
- Produces: a UI that clearly exposes Learn → Practice → Prove → Project and answers “What should I do next?”.

- [ ] **Step 1: Identify the current skill and dashboard entry points**

Trace the existing navigation from dashboard to skill journey before changing UI. Preserve the current successful visual work unless it conflicts with the new domain flow.

- [ ] **Step 2: Write tests for the next-action mapping**

The mapping must produce a deterministic next action for at least:

```text
NOT_STARTED → begin learning
EXPLORING → continue lesson/practice
PRACTICING → complete practice
APPLYING → submit proof
MASTERED → start project / continue to next skill
```

- [ ] **Step 3: Implement the smallest server-derived next-action model**

Do not calculate authoritative progress from client-only state. The UI should receive the server-derived state/action and render it.

- [ ] **Step 4: Add Practice and Prove sections to the skill journey**

Show the practice prompt, submission control, evaluation feedback, retry path, and mastery state. Keep raw AI/provider errors out of the UI.

- [ ] **Step 5: Add project state without conflating it with mastery**

A mastered skill exposes the project challenge/start action. A project-started skill remains mastered and displays project progress without changing the mastery state.

- [ ] **Step 6: Add loading, empty, and error states**

Every newly interactive learning step must have an intentional state for loading, unavailable data, failed submission, and successful submission.

- [ ] **Step 7: Run the test suite and production build**

```bash
npm test -- --run
npm run build
```

Expected: PASS.

- [ ] **Step 8: Commit**

```bash
git add app components tests
 git commit -m "feat: complete Syllarc learning journey UX"
```

---

## Task 8: Add CI and repository quality gates

**Files:**
- Create: `.github/workflows/ci.yml`
- Modify: `package.json` if a dedicated type-check script is needed.
- Modify: repository documentation only if CI setup needs explanation.

**Interfaces:**
- Consumes: repository scripts and the completed test/build commands.
- Produces: an automated GitHub Actions check that runs on pull requests and pushes to the canonical/stable development flow.

- [ ] **Step 1: Verify the required local commands**

Run:

```bash
npm run lint
npx tsc --noEmit
npm test -- --run
npm run build
```

Expected: all pass before adding CI.

- [ ] **Step 2: Create the workflow**

The workflow must:

```text
checkout
→ setup Node using the repository's supported version
→ install dependencies with the lockfile
→ lint
→ type-check
→ test
→ production build
```

Use a PostgreSQL service container only if the test suite requires database integration during CI; otherwise keep CI simpler and run pure tests without unnecessary infrastructure.

- [ ] **Step 3: Run YAML/workflow validation through GitHub Actions**

Push the workflow change through the normal branch workflow and inspect the resulting run. Do not claim CI is working until the workflow completes successfully.

- [ ] **Step 4: Commit**

```bash
git add .github package.json
git commit -m "ci: add Syllarc quality gates"
```

---

## Task 9: Align documentation with the real product

**Files:**
- Modify: `README.md`
- Modify/create: environment/setup documentation used by the repository.
- Modify: relevant architecture documentation if the repository already has it.

**Interfaces:**
- Consumes: final V1 behavior and infrastructure from Tasks 2–8.
- Produces: documentation that a recruiter or new developer can follow without encountering SQLite/PostgreSQL or feature-behavior contradictions.

- [ ] **Step 1: Write a documentation checklist**

Verify the README explains:

```text
what Syllarc is
core learning loop
architecture
local setup
DATABASE_URL/PostgreSQL
GEMINI_API_KEY
test/lint/build commands
CI purpose
V1 scope and explicit non-goals
```

- [ ] **Step 2: Update the product description**

Describe Syllarc as an AI-guided learning product centered on learning, practice, proof, mastery, and building—not merely AI course generation.

- [ ] **Step 3: Update architecture and setup**

Make the documented database, authentication model, AI validation boundary, and test/CI commands match the actual implementation.

- [ ] **Step 4: Add an engineering decisions section**

Document why the project uses a modular monolith, server-side authorization, structured AI validation, evidence-based mastery, and PostgreSQL. Keep the explanations concise and factual.

- [ ] **Step 5: Commit**

```bash
git add README.md docs
git commit -m "docs: document Syllarc V1 architecture"
```

---

## Task 10: Full V1 verification and release readiness review

**Files:**
- Inspect: all files changed by Tasks 2–9.
- Modify: only files required to fix verified defects.
- Test: full repository test/build/CI checks.

**Interfaces:**
- Consumes: completed V1 implementation.
- Produces: verified `product-upgrade` branch ready for a deliberate review/merge decision; no claim of completion without command evidence.

- [ ] **Step 1: Run formatting/lint checks**

```bash
npm run lint
```

Expected: PASS.

- [ ] **Step 2: Run type checking**

```bash
npx tsc --noEmit
```

Expected: PASS.

- [ ] **Step 3: Run the complete test suite**

```bash
npm test -- --run
```

Expected: PASS.

- [ ] **Step 4: Run the production build**

```bash
npm run build
```

Expected: PASS.

- [ ] **Step 5: Verify the critical product invariants manually**

Confirm:

```text
user can create a goal
AI roadmap is schema-validated
prerequisites block invalid progression
skill progresses only through valid states
practice can be submitted
failed evidence permits retry
passed evidence grants mastery
project start requires mastery
project start never grants mastery
users cannot access another user's data
AI/provider failures are safe
```

- [ ] **Step 6: Inspect the final diff**

Run:

```bash
git diff main...product-upgrade --stat
git diff main...product-upgrade --check
git status --short
git log --oneline --decorate -15
```

Expected: no whitespace errors, no accidental files, and every commit corresponds to a V1 decision.

- [ ] **Step 7: Perform a final architecture review**

Check that UI does not own business rules, actions remain thin, repositories do not make domain decisions, AI remains behind its boundary, and owner checks are server-side.

- [ ] **Step 8: Only after all checks pass, prepare the branch for the final integration decision**

Do not merge or push to a shared/stable branch as part of this task without explicit user approval.

---

## Completion Criteria

Syllarc V1 is ready for final review when all of the following are true:

- The PostgreSQL schema and migrations are reproducible.
- Authentication uses expiring database-backed sessions and secure cookies.
- Protected data is owner-scoped on the server.
- Progress transitions are centralized and tested.
- Prerequisites are enforced.
- Mastery requires validated evidence.
- Project start cannot grant mastery.
- AI roadmap and evaluation outputs are schema-validated before persistence.
- AI failures are safe and diagnosable.
- The dashboard and skill journey expose a coherent Learn → Practice → Prove → Mastery → Project flow.
- Tests cover the highest-value domain/security invariants.
- CI runs lint, type-check, tests, and production build successfully.
- README/setup documentation matches the actual system.
- Final lint, type-check, tests, build, and diff checks pass.

## Learning Track for the Developer

During implementation, record every concept that is introduced and why it was needed. The post-build learning phase will use the actual Syllarc code to teach at minimum:

- CI and CI/CD
- GitHub Actions
- modular monolith architecture
- server actions
- services vs repositories
- Prisma and ORM behavior
- PostgreSQL and migrations
- database transactions
- authentication vs authorization
- sessions and secure cookies
- state machines
- Zod boundary validation
- structured AI output
- AI evaluation/rubrics
- testing strategy
- environment variables
- deployment and production configuration
- Git branches, commits, pull requests, and review gates
