# Syllarc

Syllarc is a full-stack AI-guided learning product. A learner enters a goal, Syllarc generates an ordered skill journey, stores structured lessons and mastery criteria, and guides the learner through:

**Goal → Learning Path → Learn → Practice → Prove → Mastery → Project → Next Skill**

## Tech Stack

- Next.js App Router + Server Actions
- TypeScript
- Prisma ORM + PostgreSQL
- Gemini AI API
- Zod validation
- Vitest
- Tailwind CSS

## Architecture

```text
Next.js UI
    ↓
Server Actions
    ↓
Domain Services
    ├── Repositories → Prisma → PostgreSQL
    └── AI Service → Gemini
```

Business rules such as progression, prerequisites, mastery, and project eligibility live on the server. AI responses are treated as untrusted input and must pass schema and domain validation before persistence.

## Core guarantees

- Users can access only their own learning data.
- Progress follows `NOT_STARTED → EXPLORING → PRACTICING → APPLYING → MASTERED`.
- Prerequisites must be mastered before dependent skills can progress.
- Mastery requires retained evidence evaluated against explicit criteria.
- Starting a project never grants mastery.
- Goal creation is atomic through a Prisma transaction.
- PostgreSQL migrations are reproducible for fresh environments.

## Development

```bash
npm install
npx prisma generate
npm run dev
```

Required environment variables:

```text
DATABASE_URL=postgresql://...
GEMINI_API_KEY=...
```

Verification commands:

```bash
npm run lint
npx tsc --noEmit
npm test -- --run
npm run build
```

## Project status

`product-upgrade` is the canonical development branch for Syllarc V1. The `mastery-evidence` branch contains experimental work and is not merged wholesale into the stable implementation.
