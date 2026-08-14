import {
  evaluatePasswordRules,
  isStrongPassword,
} from "@/sdk/password";

describe("evaluatePasswordRules", () => {
  it("marca só as regras cumpridas", () => {
    const status = evaluatePasswordRules("abc12345");
    const byId = Object.fromEntries(status.map((rule) => [rule.id, rule.met]));

    expect(byId.minLength).toBe(true);
    expect(byId.lower).toBe(true);
    expect(byId.upper).toBe(false);
    expect(byId.number).toBe(true);
    expect(byId.special).toBe(false);
  });

  it("considera senha forte só quando todas as regras passam", () => {
    expect(isStrongPassword("abc12345")).toBe(false);
    expect(isStrongPassword("Abc12345!")).toBe(true);
  });
});
