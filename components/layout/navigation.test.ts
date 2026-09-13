import { describe, expect, it } from "vitest";
import { isNavigationItemActive, navigationItems } from "./navigation";

describe("app navigation", () => {
  it("marks the dashboard item active for dashboard routes", () => {
    const dashboard = navigationItems.find((item) => item.href === "/dashboard");

    expect(dashboard).toBeDefined();
    expect(isNavigationItemActive(dashboard!, "/dashboard")).toBe(true);
    expect(isNavigationItemActive(dashboard!, "/dashboard/settings")).toBe(true);
    expect(isNavigationItemActive(dashboard!, "/create-goal")).toBe(false);
  });

  it("marks the create-goal item active only on its route", () => {
    const createGoal = navigationItems.find((item) => item.href === "/create-goal");

    expect(createGoal).toBeDefined();
    expect(isNavigationItemActive(createGoal!, "/create-goal")).toBe(true);
    expect(isNavigationItemActive(createGoal!, "/create-goal/anything")).toBe(true);
    expect(isNavigationItemActive(createGoal!, "/dashboard")).toBe(false);
  });
});
