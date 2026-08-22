import { z } from "zod";

import { AVATAR_COLORS } from "@/sdk/dependent";

import { parentBirthDateSchema } from "./birthDate";
import { nameScheme } from "./name";

export const addDependentFormScheme = () =>
  z.object({
    name: nameScheme(),
    birthDate: parentBirthDateSchema(),
    color: z.enum(AVATAR_COLORS),
  });
