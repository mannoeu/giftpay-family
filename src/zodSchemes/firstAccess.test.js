import { firstAccessFormScheme } from "@/zodSchemes";

const schema = firstAccessFormScheme();

describe("firstAccessFormScheme", () => {
  it("reprova senha fraca", () => {
    const r = schema.safeParse({
      password: "abc12345",
    });

    expect(r.success).toBe(false);
    expect(r.error.issues[0].message).toBe("A senha não atende aos requisitos");
  });

  it("aceita senha forte", () => {
    const r = schema.safeParse({
      password: "Abc12345!",
    });

    expect(r.success).toBe(true);
  });
});
