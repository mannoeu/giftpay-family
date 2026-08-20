import { Formatter } from "@/sdk/formatter";

export const TransactionVariant = {
  in: "in",
  out: "out",
  denied: "denied",
  unknown: "unknown",
};

export const resolveTransactionVariant = (variant) =>
  Object.values(TransactionVariant).includes(variant)
    ? variant
    : TransactionVariant.unknown;

export const formatTransactionValue = (value, variant) => {
  const resolved = resolveTransactionVariant(variant);
  const formatted = Formatter.currency(Math.abs(Number(value)), {
    forcePositive: true,
  });

  if (resolved === TransactionVariant.in) return `+${formatted}`;
  if (
    resolved === TransactionVariant.out ||
    resolved === TransactionVariant.denied
  ) {
    return `-${formatted}`;
  }

  return formatted;
};

const VALUE_COLOR_BY_VARIANT = {
  [TransactionVariant.in]: "teal",
  [TransactionVariant.denied]: "danger",
  [TransactionVariant.out]: "charcoal",
  [TransactionVariant.unknown]: "charcoal",
};

export const getTransactionValueColorToken = (variant) =>
  VALUE_COLOR_BY_VARIANT[resolveTransactionVariant(variant)];

export const getTransactionVariant = ({ direction, status } = {}) => {
  if (status === "denied") return TransactionVariant.denied;
  if (direction === TransactionVariant.in) return TransactionVariant.in;
  if (direction === TransactionVariant.out) return TransactionVariant.out;
  return TransactionVariant.unknown;
};

export const serializeLastActivity = (item) => ({
  id: item?.id,
  variant: getTransactionVariant(item),
  title: item?.title,
  subtitle: item?.subtitle,
  created_at: item?.created_at,
  value: Number(item?.amount),
  letter: item?.parent?.name?.charAt(0)?.toUpperCase(),
  color: item?.parent?.color,
});
