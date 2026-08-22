import { z } from "zod";

import { MIN_PASSWORD_LENGTH } from "./constants";

const startOrEndWithBlankSpace = (value) =>
  !/^\s/.test(value) && !/\s$/.test(value);

export const passwordScheme = () =>
  z
    .string()
    .min(MIN_PASSWORD_LENGTH, {
      message: `Mínimo de ${MIN_PASSWORD_LENGTH} caracteres`,
    })
    .refine(startOrEndWithBlankSpace, {
      message: "Não deve iniciar ou finalizar com espaços em branco",
    });
