import { z } from "zod";

import { MIN_PHONE_LENGTH } from "./constants";

export const phoneScheme = () =>
  z
    .string()
    .min(MIN_PHONE_LENGTH, {
      message: "Deve conter DDD + número",
    })
    .regex(/^\(\d{2}\)\s9?\d{4}-\d{4}$/, { message: "Telefone inválido" });
