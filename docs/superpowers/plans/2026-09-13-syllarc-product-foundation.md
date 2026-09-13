# Syllarc Product Foundation Implementation Plan

## Goal
Implement the approved dark-first AppShell and dashboard foundation on `product-upgrade`, preserving existing behavior and avoiding database/AI scope expansion.

## Step 1 — Establish shell behavior tests
- Add focused tests for global navigation configuration and active-route matching.
- Add regression coverage for the authenticated dashboard shell boundary where practical.
- Run the relevant Vitest tests and confirm the new tests fail before implementation.

## Step 2 — Build shared visual foundation
- Add shared shell classes/tokens using the existing Tailwind v4 setup.
- Keep the visual system dark-first, restrained, spacious, and consistent with the approved Apple-minimal/Linear/Vercel direction.
- Avoid adding a new UI framework or replacing the existing shadcn setup.

## Step 3 — Implement reusable AppShell
- Create reusable shell components for desktop sidebar, header, and mobile navigation.
- Keep pathname-dependent active-state logic in a small client component.
- Ensure keyboard focus, semantic navigation, touch targets, and reduced-motion behavior.
- Do not create fake routes; navigation only points to routes that exist.

## Step 4 — Migrate dashboard layout
- Update `app/(dashboard)/layout.tsx` to render the authenticated AppShell after the existing auth check.
- Keep authentication server-side and preserve redirects.
- Ensure the shell provides the page content slot without taking ownership of dashboard data fetching.

## Step 5 — Refresh dashboard presentation
- Refactor `app/(dashboard)/dashboard/page.tsx` to remove duplicated global frame/navigation concerns.
- Keep its existing goal/progress service calls and calculations.
- Update `GoalGrid` and supporting presentation only as needed for the new visual hierarchy.
- Preserve New Goal, logout, empty state, current goal, next skill, and progress behavior.

## Step 6 — Protect course navigation
- Verify the course layout continues to own its specialized skill navigation.
- Make only responsive/layout changes if required by the new global shell; do not duplicate course navigation in AppShell.

## Step 7 — Verification
- Run focused tests, then the complete test suite.
- Run lint.
- Run production build.
- Inspect git diff/status and compare `product-upgrade` against its intended base.
- Fix any failures before claiming completion.

## Commit checkpoints
1. Tests for shell/navigation behavior.
2. Shared shell + AppShell implementation.
3. Dashboard migration and responsive polish.
4. Final verified cleanup if needed.

## Constraints
- No database schema changes.
- No new AI functionality.
- No unrelated product features.
- Keep server/client boundaries explicit.
- Use existing dependencies unless a necessary capability is genuinely missing.
