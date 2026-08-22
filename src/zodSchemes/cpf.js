import { z } from "zod";

import { CPF_LENGTH } from "./constants";

const isValidCPF = (cpf) => {
  const cleaned = cpf.replace(/\D/g, "");
  if (cleaned.length !== 11) return false;
  if (/^(\d)\1+$/.test(cleaned)) return false;

  let sum = 0;
  for (let i = 0; i < 9; i++) sum += parseInt(cleaned[i]) * (10 - i);
  let remainder = 11 - (sum % 11);
  if (remainder >= 10) remainder = 0;
  if (remainder !== parseInt(cleaned[9])) return false;

  sum = 0;
  for (let i = 0; i < 10; i++) sum += parseInt(cleaned[i]) * (11 - i);
  remainder = 11 - (sum % 11);
  if (remainder >= 10) remainder = 0;
  return remainder === parseInt(cleaned[10]);
};

export const cpfScheme = () =>
  z
    .string()
    .min(CPF_LENGTH, {
      message: "CPF incompleto",
    })
    .refine(isValidCPF, { message: "CPF inválido" });
