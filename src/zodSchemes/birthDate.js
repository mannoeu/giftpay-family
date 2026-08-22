import { z } from "zod";

import { isFutureDate, parseCalendarDate } from "@/sdk/dependent";

const addCalendarDateIssues = (value, ctx) => {
  const parsed = parseCalendarDate(value);

  if (!parsed.ok) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message:
        parsed.reason === "nonexistent"
          ? "A data informada não existe"
          : "Data inválida",
    });
    return null;
  }

  return parsed.date;
};

export const birthDateSchema = () =>
  z
    .string()
    .trim()
    .superRefine((value, ctx) => {
      const birthDate = addCalendarDateIssues(value, ctx);
      if (!birthDate) return;

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

export const parentBirthDateSchema = () =>
  z
    .string()
    .trim()
    .superRefine((value, ctx) => {
      if (!value) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Campo obrigatório",
        });
        return;
      }

      const birthDate = addCalendarDateIssues(value, ctx);
      if (!birthDate) return;

      if (isFutureDate(birthDate)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "A data não pode ser no futuro",
        });
      }
    });
