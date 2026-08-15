import { toPattern } from "vanilla-masker";

const cpf = (value) => {
  return toPattern(value, "999.999.999-99");
};

const currency = (value = 0, { forcePositive = false } = {}) => {
  if (value === null || value === undefined || isNaN(value)) return "-";

  let _value = value;

  if (typeof value === "string") {
    _value = parseFloat(_value).toFixed(2);
  }

  if (forcePositive) {
    _value = Math.abs(_value);
  }

  return Number(_value).toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
};

export const Formatter = {
  cpf,
  currency,
};
