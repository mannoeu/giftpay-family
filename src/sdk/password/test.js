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
    expect(byId.noEdgeSpaces).toBe(true);
  });

  it("considera senha forte só quando todas as regras passam", () => {
    expect(isStrongPassword("abc12345")).toBe(false);
    expect(isStrongPassword("Abc12345!")).toBe(true);
  });

  it("não conta espaço como caractere especial", () => {
    const status = evaluatePasswordRules("Abc 1234");
    const byId = Object.fromEntries(status.map((rule) => [rule.id, rule.met]));

    expect(byId.special).toBe(false);
    expect(isStrongPassword("Abc 1234")).toBe(false);
  });

  it("reprova senha com espaço em branco no início ou no fim", () => {
    const leading = evaluatePasswordRules(" Abc12345!");
    const trailing = evaluatePasswordRules("Abc12345! ");
    const byLeading = Object.fromEntries(
      leading.map((rule) => [rule.id, rule.met]),
    );
    const byTrailing = Object.fromEntries(
      trailing.map((rule) => [rule.id, rule.met]),
    );

    expect(byLeading.noEdgeSpaces).toBe(false);
    expect(byTrailing.noEdgeSpaces).toBe(false);
    expect(isStrongPassword(" Abc12345!")).toBe(false);
    expect(isStrongPassword("Abc12345! ")).toBe(false);
  });
});
