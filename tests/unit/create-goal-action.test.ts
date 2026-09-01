import { createGoal } from "@/actions/createGoal";
import { getCurrentUser } from "@/lib/auth";
import { AIOutputInvalidError } from "@/lib/errors/domain";
import { goalService } from "@/services/goal.service";
import { expect, it, vi } from "vitest";

vi.mock("@/lib/auth", () => ({
  getCurrentUser: vi.fn(),
}));

vi.mock("@/services/goal.service", () => ({
  goalService: {
    create: vi.fn(),
  },
}));

it("returns a user-friendly error when roadmap generation produces invalid output", async () => {
  vi.mocked(getCurrentUser).mockResolvedValue({
    id: "user-1",
    email: "actionTest@gmail.com",
    password: "hkugfohpd;dsvml",
    createdAt: new Date(),
  });

  vi.mocked(goalService.create).mockRejectedValue(
    new AIOutputInvalidError(
      "We couldn't generate a valid roadmap. Please try again.",
    ),
  );

  const formData = new FormData();
  formData.set("goal", "Become a frontend developer");

  const result = await createGoal({}, formData);

  expect(result).toEqual({
    error: "We couldn't generate a valid roadmap. Please try again.",
  });
  expect(goalService.create).toHaveBeenCalledWith(
    "Become a frontend developer",
    "user-1",
  );
});
