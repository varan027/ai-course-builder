# Syllarc V1 Product Design

**Date:** 2026-09-14  
**Canonical development branch:** `product-upgrade`  
**Stable branch:** `main`

## 1. Goal

Syllarc V1 is an AI-guided learning product that turns a learner's goal into a practical skill journey and guides them through learning, practice, proof of understanding, mastery, and a project.

The core loop is:

**Goal → Learning Path → Skill → Learn → Practice → Prove → Mastery → Project → Next Skill**

The V1 priority is reliability and usefulness of this loop, not maximum feature count.

## 2. Scope

### In scope

- Goal creation and AI-generated learning paths.
- Skill ordering and prerequisite relationships.
- Structured lesson content and learning resources.
- Explicit skill progress states.
- Practice and evidence submission.
- Evidence-based mastery evaluation with structured AI feedback.
- Project challenge and project-start tracking.
- Dashboard guidance for the next useful action.
- Authentication and server-side authorization.
- PostgreSQL persistence with reproducible Prisma migrations.
- Safe error handling and useful server logging.
- Automated linting, type checking, tests, and production build checks in CI.

### Out of scope for V1

- AI tutor/chat.
- Vector database or general-purpose RAG infrastructure.
- Knowledge-graph infrastructure.
- Spaced repetition and advanced adaptive scheduling.
- Automated code execution/evaluation.
- Billing and subscriptions.
- Social/team features.
- Mobile application.
- Microservices, queues, Redis, Kafka, Kubernetes, or similar infrastructure without a demonstrated need.
- Full portfolio/social profile system.

## 3. Architecture

Syllarc remains a modular monolith:

```text
Next.js UI
    ↓
Server Actions
    ↓
Domain Services
    ├── Repositories → Prisma → PostgreSQL
    └── AI Service → Gemini
```

### UI

`app/` and `components/` own presentation, interaction, loading, and error states. Business rules do not live in React components.

### Server Actions

Actions authenticate the user, validate inputs, call domain services, return safe results or redirects, and revalidate affected UI.

### Domain Services

Services own business rules such as progress transitions, prerequisite checks, mastery decisions, and project rules.

### Repositories

Repositories own persistence operations and owner-scoped queries. They do not decide whether an operation is allowed by the product domain.

### AI Service

Gemini-specific implementation is isolated behind the application AI service. AI output is treated as untrusted input and must pass parsing, schema validation, and domain validation before persistence.

## 4. Learning and Mastery Model

Progress answers **where the learner is**. Evidence answers **what the learner can demonstrate**.

The canonical progress state machine is:

```text
NOT_STARTED → EXPLORING → PRACTICING → APPLYING → MASTERED
```

Invalid transitions must be rejected centrally. `MASTERED` is terminal for V1.

Prerequisites must be mastered before a dependent skill can advance into its learning journey.

Mastery cannot be granted by simply starting a project. Project start and mastery are separate domain events.

V1 evidence begins with explanation/answer-based practice and practical project challenges. Evidence should be retained so later versions can build richer learning history and career evidence.

## 5. Mastery Evaluation

The evaluation pipeline is:

```text
Learner evidence
    ↓
AI evaluator
    ↓
Structured evaluation
    ↓
Schema validation
    ↓
Pass / Retry
```

The evaluator must receive explicit skill objectives and evaluation criteria. The AI must not invent the mastery rules at evaluation time.

A failed attempt gives actionable feedback and permits retry. A successful evaluation creates sufficient evidence for mastery and unlocks the project step.

## 6. Data Integrity

The system must enforce these invariants:

1. A user can access only their own learning data.
2. Every protected mutation authenticates the user and checks resource ownership.
3. Progress can only move through valid state transitions.
4. Prerequisites must be satisfied before dependent progression.
5. Mastery requires evidence; project start cannot create mastery.
6. Invalid AI output must never be persisted as valid learning data.
7. Goal aggregate creation remains atomic so partial aggregates are not persisted.
8. Database schema, migrations, environment configuration, and documentation agree on PostgreSQL as the intended production database.

## 7. Authentication and Authorization

The prototype session approach will be hardened for V1. Sessions should use an explicit server-side session model with expiration and secure cookie settings. Authentication establishes identity; authorization verifies ownership on every protected resource operation.

## 8. AI Reliability

The AI integration should use structured output where supported, strict Zod schemas, explicit domain validation, and controlled retry/failure handling. Prompts should be versioned or clearly identifiable so future output changes can be traced.

AI failures must produce safe user-facing messages without exposing provider, database, or stack-trace details.

## 9. Error Handling

Expected failures should be represented as safe application errors. User-facing messages should explain what happened and what the user can do next. Internal logs should preserve enough context to diagnose failures without exposing secrets.

## 10. Testing and CI

Tests prioritize product invariants rather than superficial UI coverage.

Highest-value coverage includes:

- progress state transitions;
- prerequisite enforcement;
- mastery evaluation behavior;
- authorization/ownership checks;
- goal aggregate creation;
- important server actions.

CI should run linting, type checking, tests, and the production build on relevant repository changes. The purpose is to catch regressions before code reaches the stable branch.

## 11. UX

The dashboard should answer **“What should I do next?”** rather than primarily displaying statistics.

The skill journey should make the current location, reason for the step, required action, and next outcome clear.

The primary experience is:

```text
Goal
 ↓
Learning Path
 ↓
Skill
 ├── Why this matters
 ├── Learn
 ├── Resources
 ├── Practice
 ├── Prove
 └── Project
```

The product should consistently communicate where the learner is, why the current step matters, what they need to do, and what happens next.

## 12. Future Extension Points

The V1 data and service boundaries should leave room for later additions without implementing them now:

- AI tutor grounded in current learning context;
- confidence and difficulty signals;
- review history and adaptive scheduling;
- richer evidence types and coding evaluation;
- portfolio/project evidence;
- shareable learning profile;
- resume-ready project summaries.

These are extension points, not V1 requirements.

## 13. Engineering Principles

- Prefer a simple modular monolith over premature distributed infrastructure.
- Keep business rules centralized and testable.
- Treat AI as an untrusted external dependency.
- Validate at boundaries.
- Enforce security on the server.
- Preserve useful learning evidence rather than only percentages.
- Improve existing boundaries when directly required by the V1 goal, but avoid unrelated refactoring.
- Optimize for a product the learner can actually use and the developer can fully explain.
