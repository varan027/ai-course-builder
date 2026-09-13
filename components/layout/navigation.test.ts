import { describe, expect, it } from "vitest";
import { isNavigationItemActive, navigationItems } from "./navigation";

describe("app navigation", () => {
  it("marks the dashboard item active only on dashboard routes", () => {
    const dashboard = navigationItems.find((item) => item.href === "/dashboard");

    expect(dashboard).toBeDefined();
    expect(isNavigationItemActive(dashboard!, "/dashboard")).toBe(true);
    expect(isNavigationItemActive(dashboard!, "/dashboard/settings")).toBe(true);
    expect(isNavigationItemActive(dashboard!, "/create-goal")).toBe(false);
  });

  it("marks course journeys active for nested course routes", () => {
    const journeys = navigationItems.find((item) => item.href === "/courses");

    expect(journeys).toBeDefined();
    expect(isNavigationItemActive(journeys!, "/courses/goal-123/2")).toBe(true);
    expect(isNavigationItemActive(journeys!, "/dashboard")).toBe(false);
  });
});
