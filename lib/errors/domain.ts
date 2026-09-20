export abstract class DomainError extends Error {
  abstract code: string;
}

export class AIOutputInvalidError extends DomainError {
  code = "AI_OUTPUT_INVALID";

  constructor(message = "The AI returned invalid output") {
    super(message);
    this.name = "AIOutputInvalidError";
  }
}

export class PrerequisitesNotSatisfiedError extends DomainError {
  code = "PREREQUISITES_NOT_SATISFIED";

  constructor(message = "Prerequisites are not satisfied") {
    super(message);
    this.name = "PrerequisitesNotSatisfiedError";
  }
}

export class SkillNotReadyForMasteryError extends DomainError {
  code = "SKILL_NOT_READY_FOR_MASTERY";

  constructor(message = "This skill is not ready for mastery evaluation") {
    super(message);
    this.name = "SkillNotReadyForMasteryError";
  }
}

export class MasteryCriteriaMissingError extends DomainError {
  code = "MASTERY_CRITERIA_MISSING";

  constructor(message = "This skill has no mastery criteria") {
    super(message);
    this.name = "MasteryCriteriaMissingError";
  }
}
