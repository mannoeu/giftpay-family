import { toPattern } from "vanilla-masker";

const cpf = (value) => {
  return toPattern(value, "999.999.999-99");
};

export const Formatter = {
  cpf,
};
