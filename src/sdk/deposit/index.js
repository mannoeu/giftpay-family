import * as Clipboard from "expo-clipboard";

import { Formatter } from "@/sdk/formatter";
import { ToastSuccess } from "@/sdk/toast";
import { WalletNameEnum } from "@/sdk/wallet";

export const DepositStatus = {
  pending: "pending",
  paid: "paid",
};

export const DepositStatusLabel = {
  [DepositStatus.pending]: "Pendente",
  [DepositStatus.paid]: "Pago",
};

export const DEPOSIT_COLOR_TOKEN = {
  [DepositStatus.pending]: "gold",
  [DepositStatus.paid]: "teal",
};

export const PIX_COPIED_MESSAGE =
  "Código Pix copiado para a área de transferência.";

export const resolveDepositStatus = (status) =>
  Object.values(DepositStatus).includes(status)
    ? status
    : DepositStatus.pending;

export const getDepositStatusLabel = (status) =>
  DepositStatusLabel[resolveDepositStatus(status)];

export const getDepositColorToken = (status) =>
  DEPOSIT_COLOR_TOKEN[resolveDepositStatus(status)];

export const serializeDeposit = (item) => {
  const status = resolveDepositStatus(item?.status);
  const colorToken = getDepositColorToken(status);
  const walletName = WalletNameEnum[item?.wallet] ?? "";

  return {
    id: item?.id,
    status,
    title: getDepositStatusLabel(status),
    subtitle: walletName ? `Carteira ${walletName}` : "Carteira",
    created_at: item?.created_at,
    paid_at: item?.paid_at ?? null,
    pix_code: item?.pix_code ?? null,
    value: Number(item?.amount),
    letter: item?.parent?.name?.charAt(0)?.toUpperCase(),
    color: item?.parent?.color,
    parentName: item?.parent?.name,
    walletName,
    titleColorToken: colorToken,
    valueColorToken: colorToken,
  };
};

export const getDepositDestinationLabel = ({
  walletName,
  parentName,
} = {}) => {
  if (!walletName || !parentName) return "";

  return `Para a carteira ${walletName} de ${parentName}`;
};

export const getDepositCreatedLabel = (createdAt) =>
  `Criado em ${Formatter.getDateAndTimeString(createdAt)}`;

export const getDepositPaidLabel = (paidAt) =>
  `Pago em ${Formatter.getDateAndTimeString(paidAt)}`;

export const copyPixCode = async (code) => {
  const value = typeof code === "string" ? code.trim() : "";
  if (!value) return false;

  await Clipboard.setStringAsync(value);
  ToastSuccess(PIX_COPIED_MESSAGE);
  return true;
};
