import { beforeEach, describe, expect, it } from "vitest";
import { getPrisma } from "@/lib/db";
import { goalRepository } from "@/lib/repositories/goal.repo";
import { resetDatabase } from "../setup/database";

describe("goalRepository.createGoalAggregate", () => {
  beforeEach(async () => {
    await resetDatabase();
  });

  it("creates a complete goal aggregate", async () => {
    const prisma = await getPrisma();

    const user = await prisma.user.create({
      data: {
        email: "test@example.com",
        password: "test-password",
      },
    });

    const goal = await goalRepository.createGoalAggregate({
      ownerId: user.id,
      title: "Frontend Developer",
      estimatedWeeks: 20,
      skills: [
        {
          skillKey: "html-fundamentals",
          skill: {
            title: "HTML Fundamentals",
            description: "Learn the structure and semantics of web pages.",
          },
          context: {
            description: "Learn semantic HTML and document structure.",
            whyImportant: "HTML provides the foundation of every web page.",
            milestone: "Can build a semantic HTML page.",
            projectChallenge: "Build a semantic portfolio page.",
          },
          prerequisites: [],
          youtubeQuery: "HTML fundamentals tutorial",
        },
        {
          skillKey: "css-basics",
          skill: {
            title: "CSS Basics",
            description: "Learn how to style and layout web pages.",
          },
          context: {
            description: "Learn CSS styling and basic layouts.",
            whyImportant: "CSS controls presentation and layout.",
            milestone: "Can style a complete HTML page.",
            projectChallenge: "Style the portfolio page.",
          },
          prerequisites: ["html-fundamentals"],
          youtubeQuery: "CSS basics tutorial",
        },
      ],
    });

    expect(goal.title).toBe("Frontend Developer");
    expect(goal.status).toBe("READY");

    const goalSkills = await prisma.goalSkill.findMany({
      where: {
        goalId: goal.id,
      },
      orderBy: {
        position: "asc",
      },
    });

    expect(goalSkills).toHaveLength(2);
    expect(goalSkills[0].position).toBe(1);
    expect(goalSkills[1].position).toBe(2);

    const dependency = await prisma.goalSkillDependency.findFirst({
      where: {
        goalSkillId: goalSkills[1].id,
      },
    });

    expect(dependency).not.toBeNull();
    expect(dependency?.prerequisiteGoalSkillId).toBe(goalSkills[0].id);
  });

  it("rolls back the entire aggregate when dependency creation fails", async () => {
    const prisma = await getPrisma();

    const user = await prisma.user.create({
      data: {
        email: "rollback@example.com",
        password: "test-password",
      },
    });

    await expect(
      goalRepository.createGoalAggregate({
        ownerId: user.id,
        title: "Frontend Developer",
        estimatedWeeks: 20,
        skills: [
          {
            skillKey: "html-fundamentals",
            skill: {
              title: "HTML Fundamentals",
              description: "Learn the structure and semantics of web pages.",
            },
            context: {
              description: "Learn semantic HTML and document structure.",
              whyImportant: "HTML provides the foundation of every web page.",
              milestone: "Can build a semantic HTML page.",
              projectChallenge: "Build a semantic portfolio page.",
            },
            prerequisites: [],
            youtubeQuery: "HTML fundamentals tutorial",
          },
          {
            skillKey: "css-basics",
            skill: {
              title: "CSS Basics",
              description: "Learn how to style and layout web pages.",
            },
            context: {
              description: "Learn CSS styling and basic layouts.",
              whyImportant: "CSS controls presentation and layout.",
              milestone: "Can style a complete HTML page.",
              projectChallenge: "Style the portfolio page.",
            },
            prerequisites: ["does-not-exist"],
            youtubeQuery: "CSS basics tutorial",
          },
        ],
      }),
    ).rejects.toThrow("Unknown prerequisite skill: does-not-exist");

    const goalCount = await prisma.goal.count({
      where: {
        ownerId: user.id,
      },
    });

    const goalSkillCount = await prisma.goalSkill.count();

    const dependencyCount = await prisma.goalSkillDependency.count();

    const skillCount = await prisma.skill.count();

    expect(skillCount).toBe(0);
    expect(goalCount).toBe(0);
    expect(goalSkillCount).toBe(0);
    expect(dependencyCount).toBe(0);
  });

  it("reuses an existing global skill across goals", async () => {
    const prisma = await getPrisma();

    const user = await prisma.user.create({
      data: {
        email: "reuse@example.com",
        password: "test-password",
      },
    });

    const skill = {
      skillKey: "javascript-fundamentals",
      skill: {
        title: "JavaScript Fundamentals",
        description: "Learn the core concepts of JavaScript.",
      },
      context: {
        description: "Learn JavaScript fundamentals for web development.",
        whyImportant: "JavaScript powers interactive web applications.",
        milestone: "Can build a small interactive JavaScript application.",
        projectChallenge: "Build a browser-based todo application.",
      },
      prerequisites: [],
      youtubeQuery: "JavaScript fundamentals tutorial",
    };

    const goalA = await goalRepository.createGoalAggregate({
      ownerId: user.id,
      title: "Frontend Developer",
      estimatedWeeks: 20,
      skills: [skill],
    });

    const goalB = await goalRepository.createGoalAggregate({
      ownerId: user.id,
      title: "Full Stack Developer",
      estimatedWeeks: 30,
      skills: [skill],
    });

    const skills = await prisma.skill.findMany({
      where: {
        skillKey: "javascript-fundamentals",
      },
    });

    const goalSkills = await prisma.goalSkill.findMany({
      where: {
        goalId: {
          in: [goalA.id, goalB.id],
        },
      },
      orderBy: {
        goalId: "asc",
      },
    });

    expect(skills).toHaveLength(1);
    expect(goalSkills).toHaveLength(2);

    expect(goalSkills[0].skillId).toBe(goalSkills[1].skillId);
    expect(goalSkills[0].id).not.toBe(goalSkills[1].id);
    expect(goalSkills[0].goalId).not.toBe(goalSkills[1].goalId);
  });

  it("isolates progress between the same skill in different goals", async () => {
    const prisma = await getPrisma();

    const user = await prisma.user.create({
      data: {
        email: "progress-isolation@example.com",
        password: "test-password",
      },
    });

    const skill = {
      skillKey: "javascript-fundamentals",
      skill: {
        title: "JavaScript Fundamentals",
        description: "Learn the core concepts of JavaScript.",
      },
      context: {
        description: "Learn JavaScript fundamentals for web development.",
        whyImportant: "JavaScript powers interactive web applications.",
        milestone: "Can build a small JavaScript application.",
        projectChallenge: "Build a browser-based todo application.",
      },
      prerequisites: [],
      youtubeQuery: "JavaScript fundamentals tutorial",
    };

    const goalA = await goalRepository.createGoalAggregate({
      ownerId: user.id,
      title: "Frontend Developer",
      estimatedWeeks: 20,
      skills: [skill],
    });

    const goalB = await goalRepository.createGoalAggregate({
      ownerId: user.id,
      title: "Full Stack Developer",
      estimatedWeeks: 30,
      skills: [skill],
    });

    const goalSkills = await prisma.goalSkill.findMany({
      where: {
        goalId: {
          in: [goalA.id, goalB.id],
        },
      },
      orderBy: {
        goalId: "asc",
      },
    });

    expect(goalSkills).toHaveLength(2);

    const goalSkillA = goalSkills[0];
    const goalSkillB = goalSkills[1];

    await prisma.skillProgress.create({
      data: {
        userId: user.id,
        goalSkillId: goalSkillA.id,
        status: "MASTERED",
      },
    });

    const progressA = await prisma.skillProgress.findUnique({
      where: {
        userId_goalSkillId: {
          userId: user.id,
          goalSkillId: goalSkillA.id,
        },
      },
    });

    const progressB = await prisma.skillProgress.findUnique({
      where: {
        userId_goalSkillId: {
          userId: user.id,
          goalSkillId: goalSkillB.id,
        },
      },
    });

    expect(progressA?.status).toBe("MASTERED");
    expect(progressB).toBeNull();
  });

  it("creates dependencies between GoalSkills within the same goal", async () => {
    const prisma = await getPrisma();

    const user = await prisma.user.create({
      data: {
        email: "dependency@example.com",
        password: "test-password",
      },
    });

    const goal = await goalRepository.createGoalAggregate({
      ownerId: user.id,
      title: "Frontend Developer",
      estimatedWeeks: 20,
      skills: [
        {
          skillKey: "html-fundamentals",
          skill: {
            title: "HTML Fundamentals",
            description: "Learn semantic HTML and document structure.",
          },
          context: {
            description: "Learn HTML structure and semantics.",
            whyImportant: "HTML is the foundation of web pages.",
            milestone: "Can create a semantic HTML page.",
            projectChallenge: "Build a semantic portfolio page.",
          },
          prerequisites: [],
          youtubeQuery: "HTML fundamentals tutorial",
        },
        {
          skillKey: "css-basics",
          skill: {
            title: "CSS Basics",
            description: "Learn how to style and layout web pages.",
          },
          context: {
            description: "Learn CSS styling and layout.",
            whyImportant: "CSS controls the visual presentation of HTML.",
            milestone: "Can create a responsive styled page.",
            projectChallenge: "Style the portfolio page.",
          },
          prerequisites: ["html-fundamentals"],
          youtubeQuery: "CSS basics tutorial",
        },
      ],
    });

    const goalSkills = await prisma.goalSkill.findMany({
      where: {
        goalId: goal.id,
      },
      orderBy: {
        position: "asc",
      },
    });

    expect(goalSkills).toHaveLength(2);

    const htmlGoalSkill = goalSkills[0];
    const cssGoalSkill = goalSkills[1];

    const dependencies = await prisma.goalSkillDependency.findMany({
      where: {
        goalSkillId: cssGoalSkill.id,
      },
    });

    expect(dependencies).toHaveLength(1);

    expect(dependencies[0].goalSkillId).toBe(cssGoalSkill.id);

    expect(dependencies[0].prerequisiteGoalSkillId).toBe(htmlGoalSkill.id);
  });

  it("keeps dependency graphs isolated between goals", async () => {
    const prisma = await getPrisma();

    const user = await prisma.user.create({
      data: {
        email: "dependency-isolation@example.com",
        password: "test-password",
      },
    });

    const skills = [
      {
        skillKey: "html-fundamentals",
        skill: {
          title: "HTML Fundamentals",
          description: "Learn semantic HTML and document structure.",
        },
        context: {
          description: "Learn HTML structure and semantics.",
          whyImportant: "HTML is the foundation of web pages.",
          milestone: "Can create a semantic HTML page.",
          projectChallenge: "Build a semantic portfolio page.",
        },
        prerequisites: [],
        youtubeQuery: "HTML fundamentals tutorial",
      },
      {
        skillKey: "css-basics",
        skill: {
          title: "CSS Basics",
          description: "Learn how to style and layout web pages.",
        },
        context: {
          description: "Learn CSS styling and layout.",
          whyImportant: "CSS controls visual presentation.",
          milestone: "Can create a responsive styled page.",
          projectChallenge: "Style the portfolio page.",
        },
        prerequisites: ["html-fundamentals"],
        youtubeQuery: "CSS basics tutorial",
      },
    ];

    const goalA = await goalRepository.createGoalAggregate({
      ownerId: user.id,
      title: "Frontend Developer",
      estimatedWeeks: 20,
      skills,
    });

    const goalB = await goalRepository.createGoalAggregate({
      ownerId: user.id,
      title: "UI Engineer",
      estimatedWeeks: 15,
      skills,
    });

    const goalSkills = await prisma.goalSkill.findMany({
      where: {
        goalId: {
          in: [goalA.id, goalB.id],
        },
      },
      orderBy: [
        {
          goalId: "asc",
        },
        {
          position: "asc",
        },
      ],
    });

    expect(goalSkills).toHaveLength(4);

    const goalASkills = goalSkills.filter(
      (goalSkill) => goalSkill.goalId === goalA.id,
    );

    const goalBSkills = goalSkills.filter(
      (goalSkill) => goalSkill.goalId === goalB.id,
    );

    expect(goalASkills).toHaveLength(2);
    expect(goalBSkills).toHaveLength(2);

    const goalADependency = await prisma.goalSkillDependency.findFirst({
      where: {
        goalSkillId: goalASkills[1].id,
      },
    });

    const goalBDependency = await prisma.goalSkillDependency.findFirst({
      where: {
        goalSkillId: goalBSkills[1].id,
      },
    });

    expect(goalADependency).not.toBeNull();
    expect(goalBDependency).not.toBeNull();

    expect(goalADependency?.prerequisiteGoalSkillId).toBe(goalASkills[0].id);

    expect(goalBDependency?.prerequisiteGoalSkillId).toBe(goalBSkills[0].id);

    expect(goalADependency?.prerequisiteGoalSkillId).not.toBe(
      goalBSkills[0].id,
    );

    expect(goalBDependency?.prerequisiteGoalSkillId).not.toBe(
      goalASkills[0].id,
    );
  });
});
