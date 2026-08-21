import { toPattern } from "vanilla-masker";

const cpf = (value) => {
  return toPattern(value, "999.999.999-99");
};

const birthDate = (value) => {
  return toPattern(value, "99/99/9999");
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

const getDate = (d) => {
  const date = new Date(d);

  const day = date.getDate().toString().padStart(2, "0");
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const year = date.getFullYear();
  const hours = date.getHours().toString().padStart(2, "0");
  const minutes = date.getMinutes().toString().padStart(2, "0");

  return {
    day,
    month,
    year,
    hours,
    minutes,
    displayDate: `${day}/${month}/${year}`,
    displayHour: `${hours}:${minutes}`,
    displayDateAndTime: `${day}/${month}/${year} às ${hours}:${minutes}`,
  };
};

const getDateAndTimeString = (d) => {
  const { day, month, year, hours, minutes } = getDate(d);
  return `${day}/${month}/${year} às ${hours}:${minutes}`;
};

export const Formatter = {
  cpf,
  birthDate,
  currency,
  getDate,
  getDateAndTimeString,
};
