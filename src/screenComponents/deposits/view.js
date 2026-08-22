import { DepositStatus, getDepositStatusLabel } from "@/sdk/deposit";

export const DEPOSITS_FILTER_ALL = null;

export const DEPOSIT_FILTER_OPTIONS = [
  { status: DEPOSITS_FILTER_ALL, label: "Todos" },
  { status: DepositStatus.paid, label: "Pago" },
  { status: DepositStatus.pending, label: "Pendente" },
];

export const getDepositsFilterName = (status) => {
  if (status == null || status === "") return "Todos";

  return getDepositStatusLabel(status);
};

export const getDepositsFilterButtonLabel = (status) =>
  `Filtrar: ${getDepositsFilterName(status)}`;

export const isDepositsFilterActive = (status) =>
  status != null && status !== "";

export const getDepositsEmptyMessage = (status) => {
  if (status === DepositStatus.paid) {
    return "Nenhum depósito pago por aqui ainda";
  }

  if (status === DepositStatus.pending) {
    return "Nenhum depósito pendente por aqui";
  }

  return "Faça um depósito para começar a usar os cartões";
};
