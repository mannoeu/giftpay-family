import { z } from "zod";

import { AVATAR_COLORS } from "@/sdk/dependent";
import { childBirthDateSchema, nameScheme } from "./index";

export const addDependentFormScheme = () =>
  z.object({
    name: nameScheme(),
    birthDate: childBirthDateSchema(),
    color: z.enum(AVATAR_COLORS),
  });
