# Syllarc Product Foundation Design

## Goal
Establish a cohesive authenticated application foundation for Syllarc so the product feels like a daily learning workspace rather than a one-time course generator. This milestone focuses on the application shell and dashboard experience while preserving the existing goal/course architecture and data model.

## Scope
- Add a reusable authenticated AppShell for app-level pages.
- Add a desktop global sidebar with clear active navigation.
- Add a compact mobile navigation experience.
- Add a reusable app header for context and primary actions.
- Establish shared dark-first visual tokens/utilities for the shell.
- Migrate the existing dashboard into the new shell without changing its core data behavior.
- Preserve the existing course-specific skill sidebar for learning pages.
- Keep the milestone free of new database tables, schema changes, AI behavior, or unrelated product features.

## Product UX
The shell should reinforce the core Syllarc loop: goal → personalized plan → learn → practice → prove understanding → progress → return.

Visual direction:
- Dark-first.
- Apple-minimal with Linear/Vercel-style density and an AI-native product feel.
- Near-black canvas with restrained borders and layered surfaces.
- Strong white/gray typography hierarchy and one restrained accent color.
- Spacious layouts, compact navigation, minimal card decoration, and subtle motion only where it improves orientation.
- Avoid gradients, excessive glass effects, decorative dashboards, and unnecessary gamification.

Global navigation:
- Dashboard/Overview must point to the existing dashboard route.
- Goals/Journeys must use only routes that exist in this milestone; do not create placeholder destinations merely to populate navigation.
- New Goal remains a prominent action where appropriate.
- Account actions include logout and can be represented in the sidebar/header without inventing an account page.

The existing course-specific sidebar remains responsible for skill-by-skill learning navigation inside `/courses/[courseId]`. The new AppShell is the global application frame and must not duplicate that course navigation.

## Responsive behavior
- Desktop/tablet: global sidebar is persistent and approximately 240–280px wide.
- Mobile: replace the persistent desktop sidebar with a compact header plus a mobile navigation control suitable for 4–5 primary actions.
- The shell must avoid horizontal overflow and maintain usable touch targets.
- Course pages must remain usable on small screens even though their existing course navigation is more specialized.

## Architecture
Use feature-oriented UI boundaries while retaining the existing server-first Next.js architecture.

Preferred flow:

`page → server action/service → repository → Prisma`

AI behavior remains isolated behind an AI service and is outside this milestone.

Application structure:
- `app/(dashboard)/layout.tsx` remains the authentication boundary and becomes the entry point for the reusable AppShell.
- Shared shell components live under a reusable layout/shell component area rather than inside the dashboard page.
- The dashboard page owns dashboard-specific data fetching and calculations.
- Dashboard presentation components remain feature-specific and receive data through props.
- UI components must not access Prisma directly.
- Client components are limited to interactions requiring browser state, such as active pathname/mobile navigation.
- No premature abstraction of domain services or database repositories is required for this visual foundation.

## Data flow
1. Authenticated request enters `app/(dashboard)/layout.tsx`.
2. Layout validates the current user and renders AppShell.
3. AppShell renders global navigation, header, and the page content slot.
4. Dashboard page fetches goals/progress through existing services.
5. Dashboard components render the existing learning data inside the new visual system.
6. Course routes continue to use their course-specific layout/navigation.

## Interaction and accessibility
- Preserve the existing authentication redirect behavior.
- Preserve loading/creating states and meaningful empty states.
- Navigation uses semantic `nav`/links and visible active states.
- Interactive controls have keyboard focus states and usable touch targets.
- Mobile navigation must be keyboard accessible and dismissible.
- Respect `prefers-reduced-motion` for decorative Framer Motion transitions.
- Do not rely on color alone to communicate active/completed state.

## Testing strategy
- Add focused unit/component tests for navigation state and shell behavior where the existing Vitest setup supports them.
- Follow TDD for each new behavior: write a failing test first, implement the smallest change, then refactor.
- Preserve existing tests and add regression coverage for the dashboard shell migration.
- Before declaring the milestone complete, run the project's test, lint, and production build commands and verify the resulting branch state.

## Success criteria
- The dashboard renders inside the new AppShell without losing existing goal/progress functionality.
- Desktop navigation has a clear active state and consistent hierarchy.
- Mobile users can reach the same primary destinations without the desktop sidebar.
- Course-specific navigation remains intact and is not duplicated by global navigation.
- No database schema changes are introduced for this milestone.
- No placeholder navigation links lead to nonexistent routes.
- The design feels cohesive across authenticated app surfaces.
- Tests, lint, and production build are verified before completion.