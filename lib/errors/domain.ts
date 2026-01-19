/**
 * Base class for all domain-level errors
 * Domain errors represent known failure cases in the system
 */
export abstract class DomainError extends Error {
  abstract code: string;
}

/**
 * Thrown when AI returns invalid or untrusted output
 */
export class AIOutputInvalidError extends DomainError {
  code = "AI_OUTPUT_INVALID";

  constructor(message: string) {
    super(message);
    this.name = "AIOutputInvalidError";
  }
}
