export const AVATAR_COLORS = [
  "#7A64C8",
  "#C06990",
  "#56A263",
  "#557FEA",
  "#BEAC48",
];

export const birthDateToIso = (value) => {
  const [day, month, year] = String(value).split("/");
  return `${year}-${month}-${day}`;
};

export const buildCreateDependentPayload = ({ name, birthDate, color }) => ({
  name: name.trim(),
  birthDate: birthDateToIso(birthDate),
  color,
});

export const appendDependentToList = (list = [], dependent) => {
  if (!dependent?.id) return list;
  if (list.some((item) => item.id === dependent.id)) return list;
  return [...list, dependent];
};

export const parseCalendarDate = (value) => {
  const trimmed = String(value ?? "").trim();
  const [dayStr, monthStr, yearStr] = trimmed.split("/");
  const day = Number(dayStr);
  const month = Number(monthStr);
  const year = Number(yearStr);

  if (
    Number.isNaN(day) ||
    Number.isNaN(month) ||
    Number.isNaN(year) ||
    day < 1 ||
    day > 31 ||
    month < 1 ||
    month > 12 ||
    year < 1900
  ) {
    return { ok: false, reason: "invalid" };
  }

  const date = new Date(year, month - 1, day);

  if (
    date.getFullYear() !== year ||
    date.getMonth() !== month - 1 ||
    date.getDate() !== day
  ) {
    return { ok: false, reason: "nonexistent" };
  }

  return { ok: true, date };
};

export const isFutureDate = (date) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const compare = new Date(date);
  compare.setHours(0, 0, 0, 0);

  return compare > today;
};
