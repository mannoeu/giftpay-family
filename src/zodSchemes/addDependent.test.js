import { addDependentFormScheme } from "./addDependent";
import { AVATAR_COLORS } from "@/sdk/dependent";

const schema = addDependentFormScheme();

const validForm = {
  name: "José",
  birthDate: "23/05/2014",
  color: AVATAR_COLORS[0],
};

describe("addDependentFormScheme", () => {
  it("aceita nome, data e cor da paleta", () => {
    const r = schema.safeParse(validForm);

    expect(r.success).toBe(true);
  });

  it("reprova nome vazio", () => {
    const r = schema.safeParse({ ...validForm, name: "" });

    expect(r.success).toBe(false);
    expect(r.error.issues[0].message).toBe("Campo obrigatório");
  });

  it("reprova nome curto", () => {
    const r = schema.safeParse({ ...validForm, name: "Jo" });

    expect(r.success).toBe(false);
    expect(r.error.issues[0].message).toBe("Mínimo de 3 caracteres");
  });

  it("reprova nome com número", () => {
    const r = schema.safeParse({ ...validForm, name: "José2" });

    expect(r.success).toBe(false);
    expect(r.error.issues[0].message).toBe(
      "O nome não pode conter números ou caracteres inválidos",
    );
  });

  it("reprova data vazia", () => {
    const r = schema.safeParse({ ...validForm, birthDate: "" });

    expect(r.success).toBe(false);
    expect(r.error.issues[0].message).toBe("Campo obrigatório");
  });

  it("reprova data malformada", () => {
    const r = schema.safeParse({ ...validForm, birthDate: "abc" });

    expect(r.success).toBe(false);
    expect(r.error.issues[0].message).toBe("Data inválida");
  });

  it("reprova dia/mês fora do intervalo", () => {
    const r = schema.safeParse({ ...validForm, birthDate: "99/99/9999" });

    expect(r.success).toBe(false);
    expect(r.error.issues[0].message).toBe("Data inválida");
  });

  it("reprova data que não existe no calendário", () => {
    const r = schema.safeParse({ ...validForm, birthDate: "31/02/2014" });

    expect(r.success).toBe(false);
    expect(r.error.issues[0].message).toBe("A data informada não existe");
  });

  it("reprova data futura", () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const day = String(tomorrow.getDate()).padStart(2, "0");
    const month = String(tomorrow.getMonth() + 1).padStart(2, "0");
    const year = tomorrow.getFullYear();

    const r = schema.safeParse({
      ...validForm,
      birthDate: `${day}/${month}/${year}`,
    });

    expect(r.success).toBe(false);
    expect(r.error.issues[0].message).toBe("A data não pode ser no futuro");
  });

  it("aceita a data de hoje", () => {
    const today = new Date();
    const day = String(today.getDate()).padStart(2, "0");
    const month = String(today.getMonth() + 1).padStart(2, "0");
    const year = today.getFullYear();

    const r = schema.safeParse({
      ...validForm,
      birthDate: `${day}/${month}/${year}`,
    });

    expect(r.success).toBe(true);
  });

  it("aceita idade maior que 16", () => {
    const r = schema.safeParse({ ...validForm, birthDate: "01/01/2000" });

    expect(r.success).toBe(true);
  });

  it("aceita 01/01/1900", () => {
    const r = schema.safeParse({ ...validForm, birthDate: "01/01/1900" });

    expect(r.success).toBe(true);
  });

  it("reprova cor fora da paleta", () => {
    const r = schema.safeParse({ ...validForm, color: "#000000" });

    expect(r.success).toBe(false);
  });
});
