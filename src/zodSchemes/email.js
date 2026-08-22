import { z } from "zod";

export const emailScheme = () =>
  z.string().trim().email({ message: "E-mail inválido" });
