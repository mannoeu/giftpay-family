import { z } from "zod";

import { isStrongPassword } from "@/sdk/password";

export const firstAccessFormScheme = () =>
  z.object({
    password: z.string().refine(isStrongPassword, {
      message: "A senha não atende aos requisitos",
    }),
  });
