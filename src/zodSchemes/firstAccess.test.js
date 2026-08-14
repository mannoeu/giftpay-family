import { firstAccessFormScheme } from "@/zodSchemes";

const schema = firstAccessFormScheme();

describe("firstAccessFormScheme", () => {
  it("reprova senha fraca", () => {
    const r = schema.safeParse({
      password: "abc12345",
      confirmPassword: "abc12345",
    });

    expect(r.success).toBe(false);
    expect(r.error.issues[0].message).toBe("A senha não atende aos requisitos");
  });

  it("reprova confirmação diferente com a mensagem certa", () => {
    const r = schema.safeParse({
      password: "Abc12345!",
      confirmPassword: "Abc12345?",
    });

    expect(r.success).toBe(false);
    expect(r.error.issues[0].message).toBe("As senhas não coincidem");
  });

  it("aceita senha forte com confirmação igual", () => {
    const r = schema.safeParse({
      password: "Abc12345!",
      confirmPassword: "Abc12345!",
    });

    expect(r.success).toBe(true);
  });
});
