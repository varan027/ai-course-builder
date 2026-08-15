import { goalService } from "./goal.service";
import { progressService } from "./progress.service";

export const dashboardService = {
  async getDashboard(userId: string) {
    const goals = await goalService.getAllForUser(userId);
    const goalsWithProgress = await Promise.all(
      goals.map(async (goal) => {
        const progress = await progressService.getProgress(userId, goal.id);
        return { ...goal, progress };
      })
    );
    return goalsWithProgress;
  }
};