import { describe, it, expect } from "vitest";
import { APP_NAME, PLANS } from "@/lib/constants";

describe("Constants", () => {
  it("has correct app name", () => {
    expect(APP_NAME).toBe("Chatterbox");
  });

  it("has plans defined", () => {
    expect(PLANS.length).toBeGreaterThan(0);
  });

  it("has a free plan", () => {
    const freePlan = PLANS.find((p) => p.name === "Free");
    expect(freePlan).toBeDefined();
    expect(freePlan!.price).toBe("$0");
  });
});
