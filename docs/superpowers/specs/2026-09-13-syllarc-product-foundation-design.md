# Syllarc Premium Product Foundation Design

## Goal
Evolve Syllarc from a conventional learning dashboard into a premium, Apple-inspired learning workspace: calm, precise, highly intentional, and centered on the learner's next action. This milestone establishes the visual and interaction foundation while preserving the existing goal/course architecture and data model.

## Product principle
The interface should not primarily answer “How much content do I have?” It should answer “What should I do next to become better?” Every major surface should reinforce the loop:

`Goal → Journey → Next Step → Learn → Practice → Prove → Mastery → Return`

The design target is **Apple's restraint + Linear's product quality + Vercel's precision + an AI-native learning experience**. The goal is not to imitate Apple branding; it is to apply principles of hierarchy, clarity, calmness, continuity, and purposeful interaction.

## Scope
- Refine the authenticated AppShell into a premium global application frame.
- Refine desktop global navigation and mobile navigation so navigation supports rather than competes with learning content.
- Establish a cohesive visual system for typography, spacing, surfaces, borders, controls, progress, and motion.
- Redesign the dashboard around the learner's current goal and immediate next learning action.
- Simplify secondary statistics and roadmap presentation so they support, rather than dominate, the learning decision.
- Preserve the existing course-specific skill sidebar for learning pages.
- Preserve existing dashboard data fetching, goal ownership, progress calculation, authentication, and routes.
- Keep this milestone free of new database tables, schema changes, AI behavior, tutor functionality, notes, gamification, knowledge graphs, or unrelated product features.

## Visual language

### Surfaces
- Use a near-black primary canvas with subtle tonal separation between navigation, content, and elevated surfaces.
- Prefer a small number of meaningful surfaces over many nested cards.
- Use borders sparingly and at low contrast; hierarchy should primarily come from spacing, typography, and surface elevation.
- Avoid decorative gradients, excessive glass effects, noisy shadows, and ornamental containers.

### Typography
- Typography is a primary hierarchy mechanism.
- Use large, confident headings for the learner's goal and next action.
- Use concise supporting copy rather than repeated uppercase labels.
- Reserve uppercase tracking labels for true section/category context, not every metric.
- Preserve the existing Geist typography setup.

### Color
- Keep the interface predominantly neutral.
- Use the existing green accent as a restrained product accent rather than a constant decoration.
- Progress, active state, and primary actions may use the accent, but color must never be the only state indicator.
- Avoid introducing multiple competing accent colors in this milestone.

### Shape and spacing
- Use generous whitespace and deliberate alignment.
- Prefer moderate radii and simple geometry over excessive pill-shaped UI.
- Reduce unnecessary vertical height in the primary dashboard hero so more learning content is visible in the initial viewport.
- Maintain consistent horizontal content alignment across dashboard sections.

### Motion
- Motion should communicate continuity, hierarchy, and state changes rather than decoration.
- Use the existing Framer Motion dependency for subtle entrance and interaction transitions where appropriate.
- Respect `prefers-reduced-motion` and avoid animation that delays access to learning content.

## Dashboard experience
The dashboard's dominant question is **“What should I do now?”**.

The primary dashboard hierarchy is:

1. Greeting/context.
2. Current goal.
3. Immediate next skill/action.
4. Primary continuation action.
5. Compact journey/progress context.
6. Secondary global progress.
7. Other learning journeys.

The current goal hero should communicate the goal, current mastery/progress, next skill, and a clear continuation action without requiring the user to parse multiple dense cards.

The intended conceptual structure is:

```text
Your learning workspace

Current goal                                      0% mastery
AI Engineer
Your next step is ready.

Journey progress ─────────────────────────────── 0%

Next up
Python Programming Fundamentals
Prepare for the next stage of your journey.

                              Continue learning →

2 journeys · 50 skills · 1 mastered

Learning journeys
AI Engineer                                      0%
Data Science                                     …
```

The exact copy may adapt to available data, but the interaction hierarchy must remain: **next action first, metrics second**.

### Empty state
When no goals exist, the dashboard should immediately explain the value of creating a learning journey and provide one obvious `Create Goal` action. Do not show empty metric cards as the primary experience.

### Multiple goals
Existing goals remain accessible through the learning journeys section. Goal cards should be visually quieter than the current goal and emphasize title, progress, and continuation rather than decorative statistics.

## Navigation

### Desktop
The global sidebar is persistent and approximately 240–280px wide. It should feel like part of the application environment, not a competing panel.

Navigation should contain only functional destinations available in the application. At minimum:
- Dashboard → `/dashboard`
- New Goal → `/create-goal`
- Logout → existing logout action

A future Journeys destination may be represented only after a real route exists; no placeholder route should be introduced merely to complete a navigation list.

The sidebar should have:
- clear brand identity;
- compact primary navigation;
- obvious current-location state;
- a restrained account/logout area anchored near the bottom;
- no large decorative empty region created by unnecessary fixed-height content.

### Mobile
On mobile, replace the persistent sidebar with a compact header and a mobile navigation control. Navigation must preserve access to the functional primary destinations and provide touch targets suitable for phone use.

## Architecture
Retain the existing server-first Next.js architecture and feature-oriented UI boundaries.

Preferred flow:

`page → server action/service → repository → Prisma`

Application structure:
- `app/(dashboard)/layout.tsx` remains the authentication boundary and renders the reusable AppShell.
- Reusable shell components remain under `components/layout/`.
- Dashboard-specific presentation remains under `app/(dashboard)/dashboard/` or another focused feature boundary if a component is genuinely reusable.
- Dashboard page owns dashboard data fetching and calculations.
- UI components receive data through props and do not access Prisma directly.
- Client components are limited to interactions requiring browser state, such as pathname-aware navigation and mobile menu state.
- The AI service remains isolated and unchanged by this milestone.
- Do not introduce new domain abstractions or database structures solely to support visual changes.

The existing course-specific layout at `/courses/[courseId]` remains responsible for skill-by-skill learning navigation. The global AppShell must not duplicate course navigation.

## Responsive behavior
- Desktop/tablet: persistent global sidebar at approximately 240–280px.
- Mobile: compact header plus mobile navigation; no horizontal overflow.
- Dashboard content uses fluid widths with a readable maximum content width.
- The primary next-action area remains prominent at narrow widths.
- Course pages retain their specialized navigation while adapting to small screens; do not redesign the course information architecture as part of this milestone.

## Accessibility and interaction
- Preserve the existing authentication redirect behavior.
- Preserve meaningful loading/creating and empty states.
- Use semantic navigation and links.
- Provide visible keyboard focus states.
- Provide usable touch targets.
- Do not communicate active, mastered, or progress state by color alone.
- Respect reduced-motion preferences.
- Primary actions must have clear labels and should not depend on icon recognition alone.

## Testing strategy
- Follow TDD for each new behavior: write a failing test first, verify the failure, implement the smallest change, verify the passing test, then refactor.
- Keep navigation route matching covered by focused unit tests.
- Add regression coverage for dashboard shell behavior where practical with the existing Vitest setup.
- Preserve the existing test suite.
- Before completion, run `npm test`, `npm run lint`, and `npm run build` from a clean working tree or explicitly document unrelated baseline lint failures.

## Success criteria
- The authenticated dashboard feels like a premium learning product rather than a generic SaaS/admin dashboard.
- The visual hierarchy makes the learner's next action immediately obvious.
- The current goal is the primary context without an oversized hero consuming most of the viewport.
- Navigation is quiet, functional, and responsive.
- Typography, spacing, surfaces, borders, controls, progress, and motion feel like one coherent design system.
- Secondary metrics and other journeys remain discoverable without competing with the next learning action.
- Existing goal/progress functionality remains intact.
- Existing course-specific navigation remains intact and is not duplicated.
- No database schema changes are introduced.
- No placeholder routes are introduced.
- Tests and production build are verified; any pre-existing lint errors are distinguished from feature regressions.