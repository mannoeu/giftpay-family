import { birthDateSchema, parentBirthDateSchema } from "@/zodSchemes";

describe("parentBirthDateSchema", () => {
  const schema = parentBirthDateSchema();

  it("aceita 23/05/2014", () => {
    expect(schema.safeParse("23/05/2014").success).toBe(true);
  });
});

describe("birthDateSchema", () => {
  const schema = birthDateSchema();

  it("continua exigindo pelo menos 16 anos", () => {
    const r = schema.safeParse("23/05/2014");

    expect(r.success).toBe(false);
    expect(r.error.issues[0].message).toBe("Deve ter pelo menos 16 anos");
  });
});
