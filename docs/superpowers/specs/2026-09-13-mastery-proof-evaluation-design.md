# Syllarc AI Mastery Proof Evaluation Design

## Goal
Replace Syllarc's current weak mastery gate with a skill-specific proof system that evaluates whether a learner demonstrated the capability the skill was intended to teach, without requiring a particular wording or guessed answer.

## Product principle
Mastery means demonstrated capability, not completion and not keyword matching.

The learning loop becomes:

`Learn → Practice → Prove → Master → Build → Evidence`

A learner should never have to guess the exact answer Syllarc expects. Equivalent correct reasoning and different valid approaches must be accepted when they demonstrate the required capabilities.

## Scope
- Generate one structured mastery proof for each generated skill.
- Store the mastery proof with the existing `GoalSkill` record.
- Support proof modes appropriate to different skill types.
- Present the learner only with the proof task and relevant context, not hidden evaluation criteria.
- Evaluate submitted evidence through a constrained AI evaluator.
- Return structured evaluation results rather than allowing the model to mutate progress directly.
- Advance `APPLYING` skills to `MASTERED` only when the application accepts a passing evaluation.
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

`Skill page → mastery action → mastery evaluator → structured result → application decision → progress service`

The application accepts `passed: true` only when the evaluator result is structurally valid and the required capabilities are demonstrated. A failed evaluation keeps the skill at `APPLYING`.

This preserves the existing architecture:

`page → server action/service → repository → Prisma`

with AI isolated behind the AI service boundary.

## Learner experience

When a learner reaches `APPLYING`, the page presents a clear checkpoint:

```text
Prove your understanding

[learner-facing task]

Your response
[textarea / appropriate evidence input]

Submit proof
```

The learner should not see the internal rubric.

### Passing

Show concise confirmation that the learner demonstrated the intended capabilities, then offer the transition toward the project/build stage.

### Failing

Do not say merely "wrong answer". Show:
- what part of the capability was demonstrated;
- what remains unclear or missing;
- a concrete direction for retrying.

The feedback should help the learner improve without simply revealing the complete answer.

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
- failed proof keeping `APPLYING` status;
- passed proof allowing `MASTERED` transition;
- legacy skills without proof remaining readable.

Before completion run `npm test`, `npm run lint`, and `npm run build`, and distinguish any pre-existing lint failures from regressions.

## Success criteria
- A learner cannot pass mastery by merely typing enough characters or matching keywords.
- A learner does not need to guess an exact expected answer.
- Proof tasks differ according to the nature of the skill.
- Evaluation is grounded in explicit skill capabilities and criteria.
- Multiple valid answers can pass when they demonstrate the same capability.
- Failed learners receive useful retry guidance rather than a dead end.
- AI evaluation cannot directly mutate progress state.
- Existing courses and progress remain compatible.
- The implementation remains small enough to extend later with richer technical evidence and mastery history without prematurely building those systems.
