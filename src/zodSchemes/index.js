import { z } from "zod";

const MIN_PASSWORD_LENGTH = 8;
const MIN_NAME_LENGTH = 3;
const CONFIRMATION_CODE_LENGTH = 6;

const startOrEndWithBlankSpace = (value) =>
  !/^\s/.test(value) && !/\s$/.test(value);

const isNameFilled = (value) => value.trim().length > 0;

const isValidName = (value) => /^[a-zA-ZÀ-ÿ\s]+$/.test(value);

const isValidNameLength = (value) => value.trim().length >= MIN_NAME_LENGTH;

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

export const passwordScheme = () =>
  z
    .string()
    .min(MIN_PASSWORD_LENGTH, {
      message: `Mínimo de ${MIN_PASSWORD_LENGTH} caracteres`,
    })
    .refine(startOrEndWithBlankSpace, {
      message: "Não deve iniciar ou finalizar com espaços em branco",
    });

export const cpfScheme = () =>
  z
    .string()
    .min(14, {
      message: "CPF incompleto",
    })
    .refine(isValidCPF, { message: "CPF inválido" });

export const phoneScheme = () =>
  z
    .string()
    .min(13, {
      message: "Deve conter DDD + número",
    })
    .regex(/^\(\d{2}\)\s9?\d{4}-\d{4}$/, { message: "Telefone inválido" });

export const nameScheme = () =>
  z
    .string()
    .refine(isNameFilled, {
      message: "Campo obrigatório",
    })
    .refine(isValidName, {
      message: "O nome não pode conter números ou caracteres inválidos",
    })
    .refine(isValidNameLength, {
      message: `Mínimo de ${MIN_NAME_LENGTH} caracteres`,
    });

export const birthDateSchema = () =>
  z
    .string()
    .trim()
    .superRefine((value, ctx) => {
      const [dayStr, monthStr, yearStr] = value.split("/");
      const day = Number(dayStr);
      const month = Number(monthStr);
      const year = Number(yearStr);

      if (
        isNaN(day) ||
        isNaN(month) ||
        isNaN(year) ||
        day < 1 ||
        day > 31 ||
        month < 1 ||
        month > 12 ||
        year < 1900
      ) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Data inválida",
        });
        return;
      }

      const birthDate = new Date(year, month - 1, day);

      if (
        birthDate.getFullYear() !== year ||
        birthDate.getMonth() !== month - 1 ||
        birthDate.getDate() !== day
      ) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "A data informada não existe",
        });
        return;
      }

      const today = new Date();

      let age = today.getFullYear() - birthDate.getFullYear();
      const monthDiff = today.getMonth() - birthDate.getMonth();

      if (
        monthDiff < 0 ||
        (monthDiff === 0 && today.getDate() < birthDate.getDate())
      ) {
        age--;
      }

      if (age < 16) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Deve ter pelo menos 16 anos",
        });
      }
    });

export const emailScheme = () =>
  z.string().trim().email({ message: "E-mail inválido" });

export const confirmationCodeScheme = () =>
  z.string().min(CONFIRMATION_CODE_LENGTH, {
    message: `O código deve ter ${CONFIRMATION_CODE_LENGTH} dígitos`,
  });

export { firstAccessFormScheme } from "./firstAccess";
