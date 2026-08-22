import { act, renderHook } from "@testing-library/react-native";

import { DepositStatus } from "@/sdk/deposit";

import { useDepositsFilter } from "./index";

describe("useDepositsFilter", () => {
  beforeEach(() => {
    jest.useRealTimers();
  });

  afterEach(() => {
    jest.useFakeTimers();
  });

  it("confirma o status selecionado", async () => {
    const { result } = await renderHook(() => useDepositsFilter(null));
    const onFilter = jest.fn();
    const closeSheet = jest.fn();

    await act(async () => {
      result.current.setPendingStatus(DepositStatus.paid);
    });
    await act(async () => {
      result.current.confirm({ onFilter, closeSheet });
    });

    expect(onFilter).toHaveBeenCalledWith(DepositStatus.paid);
    expect(closeSheet).toHaveBeenCalled();
  });

  it("confirma Todos ao voltar para todos os status", async () => {
    const { result } = await renderHook(() =>
      useDepositsFilter(DepositStatus.pending),
    );
    const onFilter = jest.fn();
    const closeSheet = jest.fn();

    await act(async () => {
      result.current.setPendingStatus(null);
    });
    await act(async () => {
      result.current.confirm({ onFilter, closeSheet });
    });

    expect(onFilter).toHaveBeenCalledWith(null);
    expect(closeSheet).toHaveBeenCalled();
  });

  it("não aplica o filtro só ao alterar a seleção pendente", async () => {
    const { result } = await renderHook(() => useDepositsFilter(null));
    const onFilter = jest.fn();

    await act(async () => {
      result.current.setPendingStatus(DepositStatus.pending);
    });

    expect(onFilter).not.toHaveBeenCalled();
    expect(result.current.isSelected(DepositStatus.pending)).toBe(true);
    expect(result.current.isSelected(null)).toBe(false);
  });

  it("confirma o último status pendente após troca rápida", async () => {
    const { result } = await renderHook(() => useDepositsFilter(null));
    const onFilter = jest.fn();
    const closeSheet = jest.fn();

    await act(async () => {
      result.current.setPendingStatus(DepositStatus.pending);
      result.current.setPendingStatus(DepositStatus.paid);
    });
    await act(async () => {
      result.current.confirm({ onFilter, closeSheet });
    });

    expect(onFilter).toHaveBeenCalledWith(DepositStatus.paid);
    expect(closeSheet).toHaveBeenCalled();
  });
});
