import { z } from "zod";

import { isStrongPassword } from "@/sdk/password";

export const firstAccessFormScheme = () =>
  z
    .object({
      password: z.string().refine(isStrongPassword, {
        message: "A senha não atende aos requisitos",
      }),
      confirmPassword: z.string(),
    })
    .superRefine((data, ctx) => {
      if (data.password !== data.confirmPassword) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "As senhas não coincidem",
          path: ["confirmPassword"],
        });
      }
    });
