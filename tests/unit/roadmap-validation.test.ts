import { describe, expect, it } from "vitest";
import { validateRoadmap } from "../../lib/domain/roadmap-validation";

it("accepts a valid roadmap", () => {
  const skills = [
    { skillKey: "A", prerequisites: [] },
    { skillKey: "B", prerequisites: ["A"] },
    { skillKey: "C", prerequisites: ["B"] },
  ];

  const result = validateRoadmap(skills);

  expect(result.valid).toBe(true);
  expect(result.errors).toHaveLength(0);
});

it("rejects a roadmap with circular dependencies", () => {
  const skills = [
    { skillKey: "A", prerequisites: ["B"] },
    { skillKey: "B", prerequisites: ["C"] },
    { skillKey: "C", prerequisites: ["A"] },
  ];

  const result = validateRoadmap(skills);

  expect(result.valid).toBe(false);
  expect(result.errors).toContain(
    "Circular dependencies detected in the roadmap.",
  );
});

it("rejects a roadmap with self prerequisites", () => {
  const skills = [
    { skillKey: "A", prerequisites: ["A"] },
    { skillKey: "B", prerequisites: [] },
  ];

  const result = validateRoadmap(skills);

  expect(result.valid).toBe(false);
  expect(result.errors).toContain(
    "Self prerequisite found: A -> A",
  );
});

it("rejects a roadmap with unknown prerequisites", () => {
  const skills = [
    { skillKey: "A", prerequisites: [] },
    { skillKey: "B", prerequisites: ["C"] },
  ];

  const result = validateRoadmap(skills);

  expect(result.valid).toBe(false);
  expect(result.errors).toContain(
    "Unknown prerequisite found: B -> C",
  );
});

it("rejects a roadmap with duplicate skill keys", () => {
  const skills = [
    { skillKey: "A", prerequisites: [] },
    { skillKey: "A", prerequisites: [] },
  ];

  const result = validateRoadmap(skills);

  expect(result.valid).toBe(false);
  expect(result.errors).toContain(
    "Duplicate Skill Key found: A",
  );
});

it("reports multiple roadmap validation errors", () => {
  const skills = [
    { skillKey: "A", prerequisites: ["B"] },
    { skillKey: "B", prerequisites: ["C"] },
    { skillKey: "C", prerequisites: ["A"] },
    { skillKey: "D", prerequisites: ["D"] },
    { skillKey: "E", prerequisites: ["F"] },
    { skillKey: "E", prerequisites: [] },
  ];

  const result = validateRoadmap(skills);

  expect(result.valid).toBe(false);

  expect(result.errors).toContain(
    "Self prerequisite found: D -> D",
  );

  expect(result.errors).toContain(
    "Unknown prerequisite found: E -> F",
  );

  expect(result.errors).toContain(
    "Duplicate Skill Key found: E",
  );
});