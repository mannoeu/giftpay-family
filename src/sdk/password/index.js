import { MIN_PASSWORD_LENGTH } from "@/zodSchemes/constants";

export const PASSWORD_RULES = [
  {
    id: "minLength",
    label: `Ao menos ${MIN_PASSWORD_LENGTH} caracteres`,
    test: (password) => password.length >= MIN_PASSWORD_LENGTH,
  },
  {
    id: "lower",
    label: "Ao menos 1 letra minúscula",
    test: (password) => /[a-z]/.test(password),
  },
  {
    id: "upper",
    label: "Ao menos 1 letra maiúscula",
    test: (password) => /[A-Z]/.test(password),
  },
  {
    id: "number",
    label: "Ao menos 1 número",
    test: (password) => /\d/.test(password),
  },
  {
    id: "special",
    label: "Ao menos 1 caractere especial",
    test: (password) => /[^A-Za-z0-9\s]/.test(password),
  },
  {
    id: "noEdgeSpaces",
    label: "Não iniciar ou finalizar com espaços",
    test: (password) =>
      !/^\s/.test(password ?? "") && !/\s$/.test(password ?? ""),
  },
];

export const evaluatePasswordRules = (password = "") =>
  PASSWORD_RULES.map((rule) => ({
    id: rule.id,
    label: rule.label,
    met: rule.test(password ?? ""),
  }));

export const isStrongPassword = (password) =>
  PASSWORD_RULES.every((rule) => rule.test(password ?? ""));
