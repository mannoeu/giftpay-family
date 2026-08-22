import { z } from "zod";

import { CONFIRMATION_CODE_LENGTH } from "./constants";

export const confirmationCodeScheme = () =>
  z.string().min(CONFIRMATION_CODE_LENGTH, {
    message: `O código deve ter ${CONFIRMATION_CODE_LENGTH} dígitos`,
  });
