import { describe, expect, it } from "vitest";
import { evaluateMasteryProof, getMasteryProofPrompt } from "@/lib/mastery-proof";

describe("mastery proof", () => {
  it("passes when the answer contains the required evidence", () => {
    expect(
      evaluateMasteryProof(
        "Explain how an HTTP client sends a GET request and how the server communicates success.",
        ["GET retrieves data", "2xx status codes indicate success"],
        "A GET request asks the server to retrieve data. A 200 response is a 2xx status code and indicates success.",
      ),
    ).toBe(true);
  });

  it("fails when the answer does not demonstrate the skill", () => {
    expect(
      evaluateMasteryProof(
        "Explain how an HTTP client sends a GET request and how the server communicates success.",
        ["GET retrieves data", "2xx status codes indicate success"],
        "HTTP is used on the web.",
      ),
    ).toBe(false);
  });

  it("creates a clear proof prompt from the skill context", () => {
    expect(
      getMasteryProofPrompt("HTTP Protocol", "Inspect HTTP traffic and construct raw requests.", "Use cURL to send a POST request."),
    ).toContain("HTTP Protocol");
  });
});
