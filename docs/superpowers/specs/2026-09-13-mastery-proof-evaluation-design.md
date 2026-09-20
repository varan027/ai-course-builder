# Syllarc AI Mastery Proof Evaluation Design

## Goal
Replace Syllarc's current weak mastery gate with a skill-specific evidence system that evaluates whether a learner demonstrated the capability the skill was intended to teach, without requiring a particular wording or guessed answer.

## Product principles

### Mastery is earned through evidence
Mastery is not a button, completion flag, or self-declared state.

The learning loop is:

`Learn → Practice → Apply → Evidence → Master`

A learner first produces evidence that demonstrates the required capability. Only after the evidence passes does Syllarc grant `MASTERED`.

### Every primary action must do real work
There must be no primary button whose only meaningful effect is changing its own label, changing visual state, or pretending to advance progress.

Every primary action must correspond to a real product transition or operation, such as:
- opening the next learning section;
- submitting evidence for evaluation;
- retrying evidence after feedback;
- starting a real project after mastery.

There is no `Mark as mastered` button. The learner cannot directly change a skill to `MASTERED`.

### The learner should not guess the answer
The evaluator judges demonstrated capability, not whether the learner reproduced an expected sentence. Equivalent correct reasoning and different valid approaches must be accepted when they demonstrate the required capabilities.

## Scope
- Generate one structured mastery proof for each generated skill.
- Store the mastery proof with the existing `GoalSkill` record.
- Support proof modes appropriate to different skill types.
- Present the learner only with the evidence task and relevant context, not hidden evaluation criteria.
- Evaluate submitted evidence through a constrained AI evaluator.
- Return structured evaluation results rather than allowing the model to mutate progress directly.
- Keep `APPLYING` as the final learning/practice state before the evidence checkpoint.
- Grant `MASTERED` only after evidence passes evaluation.
- Give actionable retry feedback when the learner has not demonstrated one or more required capabilities.
- Keep the first version lightweight: one active proof per skill, no attempt-history model, no AI tutor subsystem, no GitHub integration, and no project completion model in this milestone.

## Non-goals
- Building a general quiz engine.
- Exact-answer or keyword-based grading.
- Evaluating grammar, writing style, verbosity, or similarity to generated lesson text.
- Letting the AI directly write progress state to the database.
- Creating a mastery-attempt history table.
- Building code execution/sandbox infrastructure in this milestone.
- Reworking the dashboard.
- Closing the separate project-evidence loop; that is the next product milestone.

## Learning and mastery state

Existing progress statuses remain:

`NOT_STARTED → EXPLORING → PRACTICING → APPLYING → MASTERED`

The evidence checkpoint is intentionally **not** a separate persisted `SkillStatus` in this milestone. It is the interaction between `APPLYING` and `MASTERED`.

Conceptually:

```text
APPLYING
   ↓
Evidence checkpoint
   ↓
Evaluate evidence
   ├── insufficient → feedback → retry evidence
   │
   └── sufficient → MASTERED
```

This avoids creating a database state that merely represents a screen while still making the ordering explicit: **evidence always comes before mastery**.

A skill in `APPLYING` has not yet earned mastery. The UI should communicate that the next required action is to demonstrate the skill, not to manually mark it complete.

## Proof model

Each generated skill contains a `masteryProof` object alongside its lesson.

Conceptually:

```text
MasteryProof
├── task
├── proofType
├── capabilities[]
└── evaluationCriteria[]
```

### Fields
- `task`: learner-facing challenge written as a concrete demonstration task.
- `proofType`: one of `CONCEPTUAL`, `TECHNICAL`, `ANALYTICAL`, `PRACTICAL`, or `CREATIVE`.
- `capabilities`: concise statements describing what the learner must demonstrate.
- `evaluationCriteria`: hidden evaluator guidance describing acceptable evidence for each capability.

The criteria are not shown in the learner UI because exposing them would encourage rubric gaming. The learner receives enough task context to understand what is being asked without needing to infer a secret answer.

## Proof type selection

The proof type should reflect what competence means for the skill:

| Proof type | Appropriate demonstration |
|---|---|
| `CONCEPTUAL` | Explain a concept, distinguish related ideas, give an example/counterexample, or predict an outcome. |
| `TECHNICAL` | Implement, modify, debug, predict code/output, or design a concrete technical solution. |
| `ANALYTICAL` | Solve a concrete problem, compare options, identify trade-offs, and justify reasoning. |
| `PRACTICAL` | Choose an approach for a realistic situation and explain the execution and decisions. |
| `CREATIVE` | Produce or design a small artifact and explain the choices behind it. |

The initial evaluator interface must remain generic enough to support richer technical proof later. This milestone does not require a code runner or artifact upload system.

## Generation

Course generation asks the AI to create both the lesson and the mastery proof for every skill.

Generation requirements:
- The proof must test capabilities taught by the skill and lesson.
- The proof must require demonstration or application, not recall of a single phrase.
- Criteria must describe observable evidence rather than exact words.
- Criteria must allow multiple valid approaches where the domain permits them.
- The task must be solvable using the knowledge taught in the skill.
- The proof should be small enough to complete without becoming a separate project.

Existing legacy course fixtures may continue to omit mastery proofs for backward compatibility. New AI-generated skills must include them.

## Evaluation contract

The evaluator receives:
- the skill title and description;
- the lesson overview and key ideas;
- the mastery proof task;
- the hidden capabilities and evaluation criteria;
- the learner's submitted answer/evidence.

The evaluator returns structured data:

```text
MasteryEvaluation
├── passed
├── capabilities[]
│   ├── capability
│   └── demonstrated
├── feedback
└── retryGuidance
```

### Evaluation rules
The evaluator must:
- judge demonstrated understanding against capabilities and criteria;
- accept different valid wording and approaches;
- distinguish partial understanding from mastery;
- identify which capability is missing or weak;
- avoid requiring exact phrases or lesson-copying;
- avoid grading grammar or style unless communication quality is itself the skill;
- avoid inventing requirements that are absent from the skill criteria;
- return failure when evidence is too vague to establish the required capability.

The evaluator must not:
- directly modify `SkillProgress`;
- decide that a learner is mastered based only on answer length;
- use keyword presence as a pass condition;
- reveal hidden evaluation criteria to the learner.

## Application boundary

The AI evaluator is an isolated service. Application code owns the state transition.

Preferred flow:

`Evidence UI → mastery action → mastery evaluator → structured result → application decision → progress service`

The application accepts `passed: true` only when the evaluator result is structurally valid and the required capabilities are demonstrated. A failed evaluation keeps the skill at `APPLYING`. A passing evaluation is the only path from `APPLYING` to `MASTERED`.

The evaluator must never return an instruction such as `setStatus: MASTERED` that the application blindly executes. The application interprets the evaluation contract and decides the transition.

This preserves the existing architecture:

`page → server action/service → repository → Prisma`

with AI isolated behind the AI service boundary.

## Learner experience

When a learner reaches `APPLYING`, the page should transition naturally into the evidence checkpoint. There is no `Mark as mastered` control.

```text
You've practiced the skill.

Prove you can use it.

[learner-facing evidence task]

Your response
[appropriate evidence input]

Submit evidence
```

The primary CTA is an actual submission action. It does not merely change its label or local state.

### Before submission
The learner can read the task, provide evidence, and submit it. The task must be understandable on its own; the learner should never need to guess an exact expected answer.

### While evaluating
The submission action enters a real pending/evaluation state and prevents duplicate submissions. The UI should communicate that Syllarc is evaluating the evidence, not pretend that mastery has already happened.

### Passing evidence
Only after a valid passing evaluation does the server advance the skill to `MASTERED`.

The UI then confirms the demonstrated capability and offers the next meaningful action, such as moving to the next skill or starting the associated project.

There is no extra `Complete`, `Mark mastered`, or equivalent button between passing evidence and mastery. Passing the evidence **is** the mastery transition.

### Failing evidence
The skill remains `APPLYING`.

Show:
- what capability was demonstrated;
- what remains unclear or missing;
- a concrete direction for retrying.

The retry control must initiate a real retry/evidence submission flow. It must not simply toggle text such as `Try again` without changing the learner's available action.

Feedback should help the learner improve without simply revealing the complete answer.

## Persistence

Add nullable structured mastery-proof fields to the existing skill storage rather than creating a new mastery subsystem.

The first version may persist the proof as structured JSON if that fits the current Prisma architecture cleanly. The proof must be available at evaluation time without regenerating it.

No attempt-history table is required yet.

## Compatibility

- Existing skills without a stored mastery proof must remain readable.
- Existing progress statuses remain `NOT_STARTED`, `EXPLORING`, `PRACTICING`, `APPLYING`, `MASTERED`.
- Only the `APPLYING → MASTERED` transition changes its gate.
- Existing prerequisite enforcement remains intact.
- Existing project-start behavior remains intact.
- Existing lesson rendering remains intact.

For legacy skills without a mastery proof, the implementation must not silently grant mastery through a fake completion button. The product should provide a safe compatibility path defined during implementation, such as a clearly scoped legacy fallback, without weakening the new evidence gate for newly generated skills.

## Testing strategy

Follow TDD for each behavior:
1. Write a failing test.
2. Confirm the failure for the intended reason.
3. Implement the smallest change.
4. Run the focused test.
5. Refactor only after behavior is green.

Required coverage includes:
- proof schema validation;
- each proof type being accepted;
- generated AI skill requiring a mastery proof for new generation;
- evaluation result parsing/validation;
- equivalent valid answers not being rejected because wording differs;
- missing capability producing a retry result;
- malformed evaluator output failing safely;
- failed evidence keeping `APPLYING` status;
- passed evidence allowing `MASTERED` transition;
- no direct user action can transition `APPLYING` to `MASTERED` without evaluation;
- no primary mastery button merely changes its own label/state;
- legacy skills without proof remaining readable.

Before completion run `npm test`, `npm run lint`, and `npm run build`, and distinguish any pre-existing lint failures from regressions.

## Success criteria
- Evidence always comes before mastery.
- A learner cannot manually declare a skill mastered.
- There is no fake `Mark as mastered`/text-changing button.
- A learner cannot pass mastery by merely typing enough characters or matching keywords.
- A learner does not need to guess an exact expected answer.
- Proof tasks differ according to the nature of the skill.
- Evaluation is grounded in explicit skill capabilities and criteria.
- Multiple valid answers can pass when they demonstrate the same capability.
- Failed learners receive useful retry guidance rather than a dead end.
- AI evaluation cannot directly mutate progress state.
- Existing courses and progress remain compatible.
- The implementation remains small enough to extend later with richer technical evidence and mastery history without prematurely building those systems.
