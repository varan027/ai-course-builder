# Syllarc Premium Product UI Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Evolve the existing Syllarc authenticated experience from a conventional dashboard into a premium, Apple-inspired learning workspace centered on the user's next learning action.

**Architecture:** Preserve the existing Next.js server-first architecture and service/repository data flow. Refine the shared AppShell and dashboard presentation in focused components, keeping pathname interactions client-side and data fetching server-side; do not add database or AI functionality in this pass.

**Tech Stack:** Next.js 16 App Router, React 19, TypeScript, Tailwind CSS v4, shadcn/ui, Lucide, Framer Motion, Vitest.

**Spec:** `docs/superpowers/specs/2026-09-13-syllarc-product-foundation-design.md`

## Global Constraints

- Dark-first.
- Apple-minimal with Linear/Vercel-style density and an AI-native product feel.
- Near-black canvas with restrained borders and layered surfaces.
- Strong white/gray typography hierarchy and one restrained accent color.
- Spacious layouts, compact navigation, minimal card decoration, and subtle motion only where it improves orientation.
- Avoid gradients, excessive glass effects, decorative dashboards, and unnecessary gamification.
- The shell must reinforce `goal → personalized plan → learn → practice → prove understanding → progress → return`.
- No database schema changes.
- No new AI behavior.
- No placeholder navigation destinations.
- Preserve authentication and existing goal/progress behavior.
- Follow TDD: each new behavior gets a failing test before implementation.

---

## File Map

- Modify `components/layout/navigation.ts` — canonical global navigation model and route matching.
- Modify `components/layout/navigation.test.ts` — navigation regression coverage.
- Modify `components/layout/AppShell.tsx` — reusable desktop/mobile shell, identity, navigation, and account action presentation.
- Modify `app/(dashboard)/layout.tsx` — authenticated AppShell boundary.
- Modify `app/(dashboard)/dashboard/page.tsx` — premium dashboard composition and next-action hierarchy while retaining existing server data fetching.
- Modify `app/(dashboard)/dashboard/GoalGrid.tsx` — restrained learning-journey list/cards.
- Modify `app/globals.css` — shared premium surface, typography, focus, and motion tokens only where Tailwind utilities are insufficient.
- Modify `app/(course)/courses/[courseId]/layout.tsx` — responsive compatibility with the global visual system without removing course-specific navigation.
- Create `components/layout/AppShell.test.tsx` — shell behavior regression tests where the current test environment can render the component.

---

### Task 1: Lock Navigation and Shell Contracts

**Files:**
- Modify: `components/layout/navigation.ts`
- Modify: `components/layout/navigation.test.ts`
- Create: `components/layout/AppShell.test.tsx`

**Interfaces:**
- `navigationItems` remains the canonical list consumed by AppShell.
- `isNavigationItemActive(item, pathname)` remains a pure route-matching helper.
- AppShell tests cover the public navigation labels/actions rather than implementation-specific CSS.

- [ ] **Step 1: Write failing navigation tests**

Add tests that require:
- Dashboard is active on `/dashboard` and `/dashboard/...`.
- New Goal is active on `/create-goal`.
- No global item claims `/courses/...` unless that destination is intentionally present and functional.
- Every navigation item's `href` is one of the routes currently implemented by the app.

```ts
it("keeps every global navigation destination backed by an implemented route", () => {
  const implementedRoutes = new Set(["/dashboard", "/create-goal"]);
  expect(navigationItems.every((item) => implementedRoutes.has(item.href))).toBe(true);
});
```

- [ ] **Step 2: Run focused tests and verify the new contract fails**

Run:

```bash
npx vitest components/layout/navigation.test.ts --run
```

Expected: FAIL if the current navigation configuration exposes a route outside the implemented route set.

- [ ] **Step 3: Implement the smallest navigation model that satisfies the contract**

Keep only functional global destinations. Represent course navigation separately in the course layout. Keep New Goal as a primary action rather than pretending it is a full section.

- [ ] **Step 4: Run focused tests and verify they pass**

Run:

```bash
npx vitest components/layout/navigation.test.ts --run
```

Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add components/layout/navigation.ts components/layout/navigation.test.ts components/layout/AppShell.test.tsx
git commit -m "test: lock premium app shell navigation contract"
```

---

### Task 2: Refine the Premium AppShell

**Files:**
- Modify: `components/layout/AppShell.tsx`
- Modify: `app/globals.css`
- Test: `components/layout/AppShell.test.tsx`

**Interfaces:**
- AppShell accepts `children: React.ReactNode` and owns only global framing.
- Logout remains a server action form and is not moved into client state.
- Mobile navigation exposes the same functional destinations as desktop navigation.

- [ ] **Step 1: Write failing shell behavior tests**

Test that the rendered shell exposes the Syllarc identity, Dashboard navigation, New Goal action, and Logout control; when a mobile navigation control is present, it has an accessible name and does not remove the desktop navigation semantics from the component contract.

```tsx
it("renders the core authenticated shell actions", () => {
  render(<AppShell><div>content</div></AppShell>);
  expect(screen.getByText("Syllarc")).toBeInTheDocument();
  expect(screen.getByRole("link", { name: /dashboard/i })).toBeInTheDocument();
  expect(screen.getByRole("link", { name: /new goal/i })).toBeInTheDocument();
  expect(screen.getByRole("button", { name: /log out/i })).toBeInTheDocument();
});
```

- [ ] **Step 2: Run the focused test and verify it fails against the current shell contract**

Run:

```bash
npx vitest components/layout/AppShell.test.tsx --run
```

Expected: FAIL for any newly required accessible shell behavior.

- [ ] **Step 3: Implement the premium shell**

Use a persistent desktop rail around 248px wide, near-black layered surfaces, restrained 1px separators, and compact navigation. Keep the content area visually dominant. Use a mobile header/navigation control below the desktop breakpoint, preserve touch targets of at least 44px, and give the active route both visual and non-color semantics. Keep motion subtle and disable decorative transitions under `prefers-reduced-motion`.

- [ ] **Step 4: Run focused tests and then the complete suite**

Run:

```bash
npx vitest components/layout/AppShell.test.tsx --run
npm test
```

Expected: both commands exit 0.

- [ ] **Step 5: Commit**

```bash
git add components/layout/AppShell.tsx components/layout/AppShell.test.tsx app/globals.css
git commit -m "feat: refine Syllarc premium app shell"
```

---

### Task 3: Recompose the Dashboard Around the Next Action

**Files:**
- Modify: `app/(dashboard)/dashboard/page.tsx`
- Modify: `app/(dashboard)/dashboard/GoalGrid.tsx`
- Test: `components/layout/AppShell.test.tsx` only for shell boundaries; existing dashboard/service tests remain unchanged.

**Interfaces:**
- Dashboard page continues to use `goalService.getAllForUser` and `progressService.getProgress`.
- `GoalWithMeta` remains the data contract passed to GoalGrid.
- New UI copy must describe learning actions without inventing unavailable lesson/session data.

- [ ] **Step 1: Add a pure dashboard presentation helper test before changing behavior**

Extract a small pure helper only if needed for selecting the current goal's next unmastered skill, then test the existing behavior:

```ts
it("selects the first unmastered skill as the next learning step", () => {
  expect(getNextLearningSkill([
    { mastered: true, skill: { title: "Foundations" } },
    { mastered: false, skill: { title: "Python Fundamentals" } },
  ])?.skill.title).toBe("Python Fundamentals");
});
```

- [ ] **Step 2: Run the focused test and verify the helper is initially absent/failing**

Run:

```bash
npx vitest tests/unit/dashboard-next-step.test.ts --run
```

Expected: FAIL before the helper is introduced.

- [ ] **Step 3: Implement the minimal helper and dashboard composition**

Keep server data fetching in the page. Make the current goal the dominant visual object, place the next skill and existing project challenge beneath a concise action-oriented heading, and make the primary CTA link to the existing course route. Do not claim that an unavailable lesson, timer, exercise, or AI session exists. Reduce global statistics to quiet supporting information. Keep the empty state focused on creating the first goal.

- [ ] **Step 4: Refine GoalGrid into a quieter journey list**

Keep goal cards compact, remove unnecessary repeated metadata labels, retain progress and next skill, and preserve links to `/courses/{goal.id}`. Use subtle hover/focus states rather than large decorative effects.

- [ ] **Step 5: Run dashboard-focused and full tests**

Run:

```bash
npx vitest tests/unit/dashboard-next-step.test.ts --run
npm test
```

Expected: PASS.

- [ ] **Step 6: Commit**

```bash
git add "app/(dashboard)/dashboard/page.tsx" "app/(dashboard)/dashboard/GoalGrid.tsx" tests/unit/dashboard-next-step.test.ts
 git commit -m "feat: center dashboard on next learning action"
```

---

### Task 4: Make Course Navigation Responsive and Visually Consistent

**Files:**
- Modify: `app/(course)/courses/[courseId]/layout.tsx`
- Modify: `app/(course)/courses/[courseId]/SidebarNav.tsx` only if required by the responsive layout.

**Interfaces:**
- Course-specific skill navigation remains owned by the course route.
- Existing `courseId`, `goalSkills`, and `completedSet` inputs remain unchanged.

- [ ] **Step 1: Add a regression assertion for course navigation ownership**

Use the existing navigation test suite to assert global navigation does not render skill-specific links. Keep course-specific navigation tests separate from global navigation tests.

- [ ] **Step 2: Run the regression test and verify it fails if the shell begins duplicating course navigation**

Run:

```bash
npx vitest components/layout/navigation.test.ts --run
```

Expected: PASS once the global navigation contains no course skill links.

- [ ] **Step 3: Implement responsive course layout compatibility**

Reduce the desktop course rail only if needed for the premium system, and on small screens replace the fixed 360px rail with a compact course navigation surface that does not create horizontal overflow. Preserve the content route, progress calculations, and skill completion behavior.

- [ ] **Step 4: Run tests and build**

Run:

```bash
npm test
npm run build
```

Expected: PASS and successful production compilation.

- [ ] **Step 5: Commit**

```bash
git add "app/(course)/courses/[courseId]/layout.tsx" "app/(course)/courses/[courseId]/SidebarNav.tsx"
git commit -m "feat: align course navigation with premium shell"
```

---

### Task 5: Premium Visual QA and Accessibility Polish

**Files:**
- Modify: `app/globals.css`
- Modify: `components/layout/AppShell.tsx`
- Modify: `app/(dashboard)/dashboard/page.tsx`
- Modify: `app/(dashboard)/dashboard/GoalGrid.tsx`

- [ ] **Step 1: Run the full verification baseline**

Run:

```bash
npm test
npm run lint
npm run build
```

Record any lint failures that predate this branch separately; do not change unrelated authentication/test infrastructure solely to hide baseline errors.

- [ ] **Step 2: Inspect the running dashboard at desktop width**

Run:

```bash
npm run dev
```

Verify visually:
- the main learning action is the first thing the eye finds after the page title;
- the sidebar is quiet rather than dominant;
- content has generous but not wasteful spacing;
- cards do not look like generic admin widgets;
- focus states are visible;
- no horizontal overflow occurs.

- [ ] **Step 3: Inspect the running dashboard at mobile width**

Use browser responsive mode around 390px wide. Verify the mobile navigation is reachable, dismissible where applicable, has usable touch targets, and exposes the same functional destinations as desktop.

- [ ] **Step 4: Apply only evidence-based polish**

Adjust typography scale, spacing, border opacity, surface contrast, icon sizing, and motion timing only where visual inspection shows a concrete issue. Do not add gradients, glassmorphism, decorative metrics, or new dependencies.

- [ ] **Step 5: Re-run verification**

Run:

```bash
npm test
npm run lint
npm run build
```

Expected: tests and build pass. Lint may continue to report the five baseline errors already confirmed outside this branch's changed files.

- [ ] **Step 6: Commit final polish**

```bash
git add app/globals.css components/layout/AppShell.tsx "app/(dashboard)/dashboard/page.tsx" "app/(dashboard)/dashboard/GoalGrid.tsx"
git commit -m "style: polish Syllarc premium learning workspace"
```

---

## Final Verification Checklist

- [ ] `npm test` exits 0 with all existing and new tests passing.
- [ ] `npm run build` exits 0.
- [ ] `npm run lint` is run and its output is compared with the known baseline; no new lint errors are introduced by this work.
- [ ] `git diff rework-branch...product-upgrade --name-only` contains only intentional premium foundation files and documentation.
- [ ] Dashboard authentication and logout still work.
- [ ] Existing New Goal flow still works.
- [ ] Existing goal/course links still work.
- [ ] Course-specific skill navigation is not duplicated globally.
- [ ] Desktop and mobile layouts have no horizontal overflow.
- [ ] Active navigation is communicated without color alone.
- [ ] Reduced-motion users do not receive decorative motion that ignores their preference.
