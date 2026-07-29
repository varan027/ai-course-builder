import { aiService } from "./ai.service";
import { goalRepository } from "@/lib/repositories/course.repo";
import { Roadmap, RoadmapSchema } from "@/lib/ai/schema";
import type { User } from "@prisma/client";
import { youtubeService } from "./youtube.service";

export type Goal = {
  id: string;
  title: string;
  roadmap: Roadmap;
  ownerId: string;
};

export const goalService = {
  async create(goal: string, user: User) {
    const roadmap = await aiService.generateRoadmap(goal);

    const skillsWithVideos = await Promise.all(
      roadmap.skills.map(async (skill) => {
        try {
          const video = await youtubeService.searchTopVideo(
            skill.youtubeQuery
          );

          return {
            ...skill,
            youtubeVideoId: video?.videoId,
          };
        } catch {
          return skill;
        }
      })
    );

    const finalRoadmap: Roadmap = {
      ...roadmap,
      skills: skillsWithVideos,
    };

    return goalRepository.create({
      title: finalRoadmap.goal,
      roadmap: finalRoadmap,
      ownerId: user.id,
    });
  },

  async getAllForUser(user: User) {
    const goals = await goalRepository.findAllByOwner(user.id);

    return goals.map((goal) => ({
      ...goal,
      roadmap: RoadmapSchema.parse(goal.roadmap),
    }));
  },

  async getById(goalId: string, user: User) {
    const goal = await goalRepository.findOwned(goalId, user.id);

    if (!goal) {
      throw new Error("Goal not found");
    }

    return {
      ...goal,
      roadmap: RoadmapSchema.parse(goal.roadmap),
    };
  },
};