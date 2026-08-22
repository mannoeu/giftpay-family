import { z } from "zod";

import { MIN_NAME_LENGTH } from "./constants";

const isNameFilled = (value) => value.trim().length > 0;

const isValidName = (value) => /^[a-zA-ZÀ-ÿ\s]+$/.test(value);

const isValidNameLength = (value) => value.trim().length >= MIN_NAME_LENGTH;

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
