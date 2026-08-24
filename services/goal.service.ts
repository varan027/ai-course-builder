import { aiService } from "./ai.service";
import { goalRepository } from "@/lib/repositories/goal.repo";
import type { User } from "@prisma/client";

export const goalService = {
  async create(goal: string, user: User) {
    const roadmap = await aiService.generateRoadmap(goal);

    return goalRepository.createGoalAggregate({
      ownerId: user.id,

      title: roadmap.goal.title,
      estimatedWeeks: roadmap.goal.estimatedWeeks,

      skills: roadmap.skills,
    })
  },

  async getAllForUser(userId : string) {
    return goalRepository.findAllByOwner(userId);
  },

  async getById(goalId: string, userId: string) {
    const goal = await goalRepository.findOwned(goalId, userId);

    if (!goal) {
      throw new Error("Goal not found");
    }

    return goal;
  },
};