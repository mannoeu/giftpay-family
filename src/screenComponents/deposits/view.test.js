import { DepositStatus } from "@/sdk/deposit";

import {
  DEPOSITS_FILTER_ALL,
  getDepositsEmptyMessage,
  getDepositsFilterButtonLabel,
  getDepositsFilterName,
  isDepositsFilterActive,
} from "./view";

describe("getDepositsFilterName", () => {
  it("usa Todos quando o filtro é a família de status", () => {
    expect(getDepositsFilterName(DEPOSITS_FILTER_ALL)).toBe("Todos");
  });

  it("usa Pago e Pendente quando o status está selecionado", () => {
    expect(getDepositsFilterName(DepositStatus.paid)).toBe("Pago");
    expect(getDepositsFilterName(DepositStatus.pending)).toBe("Pendente");
  });
});

describe("getDepositsFilterButtonLabel", () => {
  it("prefixa Filtrar no nome atual", () => {
    expect(getDepositsFilterButtonLabel(DEPOSITS_FILTER_ALL)).toBe(
      "Filtrar: Todos",
    );
    expect(getDepositsFilterButtonLabel(DepositStatus.paid)).toBe(
      "Filtrar: Pago",
    );
    expect(getDepositsFilterButtonLabel(DepositStatus.pending)).toBe(
      "Filtrar: Pendente",
    );
  });
});

describe("isDepositsFilterActive", () => {
  it("fica inativo quando o filtro é Todos", () => {
    expect(isDepositsFilterActive(DEPOSITS_FILTER_ALL)).toBe(false);
    expect(isDepositsFilterActive("")).toBe(false);
  });

  it("fica ativo quando um status está selecionado", () => {
    expect(isDepositsFilterActive(DepositStatus.paid)).toBe(true);
    expect(isDepositsFilterActive(DepositStatus.pending)).toBe(true);
  });
});

describe("getDepositsEmptyMessage", () => {
  it("usa a mensagem da família quando o filtro é Todos", () => {
    expect(getDepositsEmptyMessage(DEPOSITS_FILTER_ALL)).toBe(
      "Faça um depósito para começar a usar os cartões",
    );
  });

  it("usa a mensagem de pago", () => {
    expect(getDepositsEmptyMessage(DepositStatus.paid)).toBe(
      "Nenhum depósito pago por aqui ainda",
    );
  });

  it("usa a mensagem de pendente", () => {
    expect(getDepositsEmptyMessage(DepositStatus.pending)).toBe(
      "Nenhum depósito pendente por aqui",
    );
  });
});
