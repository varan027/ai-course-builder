import type { Skill } from "../ai/schema";

type RoadmapValidationResult = {
  valid: boolean;
  errors: string[];
};

type RoadmapSkillDependencyInput = {
  skillKey: string;
  prerequisites: string[];
};

export function validateRoadmap(
  skills: RoadmapSkillDependencyInput[],
): RoadmapValidationResult {
  const duplicateErrors = findDuplicateSkillKeys(skills);
  const unknownDependencyErrors = findUnknownPrerequisites(skills);
  const selfDependencyErrors = findSelfPrerequisites(skills);

  const errors = [
    ...duplicateErrors,
    ...unknownDependencyErrors,
    ...selfDependencyErrors,
  ];

  if (errors.length > 0) {
    return {
      valid: false,
      errors,
    };
  }

  const graph = buildGraph(skills);

  if (hasCycle(graph)) {
    errors.push("Circular dependencies detected in the roadmap.");
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

function buildGraph(skills: RoadmapSkillDependencyInput[]) {
  const graph = new Map<string, string[]>();

  for (const skill of skills) {
    graph.set(skill.skillKey, []);
  }

  for (const skill of skills) {
    for (const prerequisite of skill.prerequisites) {
      graph.get(prerequisite)?.push(skill.skillKey);
    }
  }

  return graph;
}

function hasCycle(
  graph: Map<string, string[]>,
): boolean {
  const state = new Map<
    string,
    "UNVISITED" | "VISITING" | "VISITED"
  >();

  for (const [skillKey] of graph) {
    state.set(skillKey, "UNVISITED");
  }

  for (const [skillKey] of graph) {
    if (state.get(skillKey) === "UNVISITED") {
      if (dfs(skillKey, graph, state)) {
        return true;
      }
    }
  }

  return false;
}

function dfs(
  skillKey: string,
  graph: Map<string, string[]>,
  state: Map<string, "UNVISITED" | "VISITING" | "VISITED">,
): boolean {
  state.set(skillKey, "VISITING");

  for (const neighbor of graph.get(skillKey) || []) {
    if (
      state.get(neighbor) === "VISITING" ||
      (state.get(neighbor) === "UNVISITED" &&
        dfs(neighbor, graph, state))
    ) {
      return true;
    }
  }

  state.set(skillKey, "VISITED");

  return false;
}

function findDuplicateSkillKeys(skills: RoadmapSkillDependencyInput[]): string[] {
  const seen = new Set<string>();
  const duplicates = new Set<string>();

  for (const skill of skills) {
    if (seen.has(skill.skillKey)) {
      duplicates.add(
        `Duplicate Skill Key found: ${skill.skillKey}`,
      );
    } else {
      seen.add(skill.skillKey);
    }
  }

  return Array.from(duplicates);
}

function findUnknownPrerequisites(skills: RoadmapSkillDependencyInput[]): string[] {
  const skillKeys = new Set(
    skills.map((skill) => skill.skillKey),
  );

  const unknownPrerequisites = new Set<string>();

  for (const skill of skills) {
    for (const prerequisite of skill.prerequisites) {
      if (!skillKeys.has(prerequisite)) {
        unknownPrerequisites.add(
          `Unknown prerequisite found: ${skill.skillKey} -> ${prerequisite}`,
        );
      }
    }
  }

  return Array.from(unknownPrerequisites);
}

function findSelfPrerequisites(skills: RoadmapSkillDependencyInput[]): string[] {
  const selfPrerequisites = new Set<string>();

  for (const skill of skills) {
    for (const prerequisite of skill.prerequisites) {
      if (skill.skillKey === prerequisite) {
        selfPrerequisites.add(
          `Self prerequisite found: ${skill.skillKey} -> ${prerequisite}`,
        );
      }
    }
  }

  return Array.from(selfPrerequisites);
}