# Syllarc

> An AI-powered learning operating system that turns a career or skill goal into a practical path to mastery.

Syllarc is built around a simple idea: learning is more useful when the product tells you **what to learn, why it matters, what to practice, what to build next, and when you are ready to move on**.

## Product loop

**Goal → Roadmap → Skill → Resource → Practice → Project → Mastery → Next skill**

The product is intentionally moving beyond a static AI-generated course. The long-term direction is an adaptive learning system with retention signals, revision planning, a knowledge graph, and an AI tutor.

## What works today

- AI-generated, structured learning roadmaps
- Goal-specific skill sequences with prerequisites and milestones
- YouTube learning resources mapped to skills
- Project challenges designed to turn concepts into practice
- Persistent, user-owned learning progress
- Mastery tracking and a focused “next skill” experience
- Authentication with HTTP-only cookies
- Schema validation and defensive AI output handling
- Responsive dark-first UI with subtle motion and product-focused navigation

## Product roadmap

### V1 — Core learning loop

- [x] Goal creation
- [x] AI roadmap generation
- [x] Skill journey
- [x] Learning resources
- [x] Project challenges
- [x] Mastery tracking
- [x] Dashboard “next action” experience
- [ ] Skill-level notes and bookmarks
- [ ] Practice submissions / reflections

### V2 — Adaptive learning

- [ ] AI tutor grounded in the current goal and skill
- [ ] Retrieval / revision sessions
- [ ] Confidence and difficulty signals
- [ ] Personalized daily learning plan
- [ ] Knowledge graph of skills and prerequisites
- [ ] Weak-skill detection

### V3 — Proof of learning

- [ ] Project portfolio tracking
- [ ] Rubrics and project evaluation
- [ ] Shareable learning profile
- [ ] Resume-ready project summaries
- [ ] Goal completion reports

## Tech stack

- **Next.js 16** — App Router and Server Actions
- **TypeScript** — application and domain types
- **Prisma + PostgreSQL** — persistence
- **Gemini API** — roadmap generation
- **Zod** — runtime validation of AI/domain input
- **YouTube Data API** — learning resource discovery
- **Tailwind CSS** — responsive UI
- **Framer Motion** — interaction and transition polish
- **Lucide** — interface icons

## Architecture

The application uses a service-oriented structure around Next.js:

```text
app/            UI, routing, layouts
components/     reusable UI primitives
actions/        server-side mutations and validation
services/       domain/business logic
lib/            auth, AI, Prisma and shared utilities
prisma/         database schema
```

AI output is validated before it becomes product data. Authentication and ownership checks are performed server-side so users only access their own goals and progress.

## Local development

### 1. Install dependencies

```bash
npm install
```

### 2. Configure environment variables

Create `.env.local` with the variables required by your local Prisma, Gemini, and YouTube setup.

### 3. Generate Prisma client / migrate

```bash
npx prisma generate
npx prisma migrate dev
```

### 4. Run the app

```bash
npm run dev
```

The app runs locally at `http://localhost:3000`.

## Quality bar

Every feature should improve at least one of these outcomes:

1. **Learn** — understand something better.
2. **Practice** — use it rather than only reading it.
3. **Build** — produce evidence of skill.
4. **Retain** — make the knowledge more durable.
5. **Return** — make the next learning action obvious.

Syllarc should feel less like an AI content generator and more like a coach that continuously moves a learner toward a meaningful outcome.

## Project status

Active development. The current focus is making the core learning loop reliable, useful, and polished enough for real users before expanding into heavier adaptive-learning features.
