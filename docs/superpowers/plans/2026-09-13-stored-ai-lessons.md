# Stored AI Lesson Experience Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use `superpowers:executing-plans` to execute this plan task-by-task.

**Goal:** Add AI-generated lesson content to each generated skill, store it with the GoalSkill, and present a focused Learn → Practice → Apply experience without generating lessons on every page visit.

**Architecture:** Extend the existing roadmap generation contract so one Gemini response contains the lesson for each skill. Persist the lesson as structured text fields on GoalSkill. Keep the existing service/repository layering and render the stored lesson on the existing skill page. Existing goals remain readable through fallback content; newly generated goals receive full lessons.

**Tech Stack:** Next.js App Router, TypeScript, Prisma/SQLite, Gemini, Zod, Vitest, Tailwind.

## Task 1 — Lock lesson contract with tests

- Extend AI service tests with a representative lesson payload.
- Add a pure lesson presentation helper test for section labels/content defaults.
- Run focused tests and confirm RED before implementation.

## Task 2 — Extend AI generation contract

- Add a `lesson` object to `SkillSchema` with overview, key ideas, lesson content, and practice exercise.
- Update the roadmap prompt to request concise, actionable lesson material.
- Preserve strict parsing and existing roadmap validation.

## Task 3 — Persist generated lessons

- Add nullable lesson fields to `GoalSkill` so existing database rows remain valid.
- Add a Prisma migration.
- Pass lesson data through `goalRepository.createGoalAggregate`.
- Include lesson fields in owned goal queries.

## Task 4 — Render the learning session

- Replace the information-only center of the skill page with stored lesson content.
- Show Learn, Key ideas, Practice, and Apply sections.
- Keep the existing mastery/progression flow and single primary action.
- Provide a graceful fallback for existing goals without generated lesson data.

## Task 5 — Verification

Run focused tests, full tests, lint, and build locally. Verify the learning page at desktop and mobile widths. Do not claim completion until verification output is available.
