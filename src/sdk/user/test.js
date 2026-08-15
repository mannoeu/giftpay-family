import { getFirstName } from "@/sdk/user";

describe("getFirstName", () => {
  it("usa first_name quando existir", () => {
    expect(getFirstName({ first_name: "Ana Clara" })).toBe("Ana");
  });

  it("cai no name quando não há first_name", () => {
    expect(getFirstName({ name: "Ana" })).toBe("Ana");
  });

  it("devolve string vazia sem usuário", () => {
    expect(getFirstName(null)).toBe("");
  });
});
