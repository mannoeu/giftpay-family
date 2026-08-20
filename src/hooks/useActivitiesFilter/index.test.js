import { act, renderHook } from "@testing-library/react-native";

import { useActivitiesFilter } from "./index";

describe("useActivitiesFilter", () => {
  beforeEach(() => {
    jest.useRealTimers();
  });

  afterEach(() => {
    jest.useFakeTimers();
  });

  it("confirma o filho selecionado", async () => {
    const { result } = await renderHook(() => useActivitiesFilter(null));
    const onFilter = jest.fn();
    const closeSheet = jest.fn();

    await act(async () => {
      result.current.setPendingParentId(1);
    });
    await act(async () => {
      result.current.confirm({ onFilter, closeSheet });
    });

    expect(onFilter).toHaveBeenCalledWith(1);
    expect(closeSheet).toHaveBeenCalled();
  });

  it("confirma Todos ao voltar para a família", async () => {
    const { result } = await renderHook(() => useActivitiesFilter(1));
    const onFilter = jest.fn();
    const closeSheet = jest.fn();

    await act(async () => {
      result.current.setPendingParentId(null);
    });
    await act(async () => {
      result.current.confirm({ onFilter, closeSheet });
    });

    expect(onFilter).toHaveBeenCalledWith(null);
    expect(closeSheet).toHaveBeenCalled();
  });

  it("não aplica o filtro só ao alterar a seleção pendente", async () => {
    const { result } = await renderHook(() => useActivitiesFilter(null));
    const onFilter = jest.fn();

    await act(async () => {
      result.current.setPendingParentId(2);
    });

    expect(onFilter).not.toHaveBeenCalled();
    expect(result.current.isSelected(2)).toBe(true);
    expect(result.current.isSelected(null)).toBe(false);
  });
});
