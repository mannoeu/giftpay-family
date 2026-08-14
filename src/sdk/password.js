export const PASSWORD_RULES = [
  {
    id: "minLength",
    label: "Ao menos 8 caracteres",
    test: (password) => password.length >= 8,
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
    test: (password) => /[^A-Za-z0-9]/.test(password),
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
