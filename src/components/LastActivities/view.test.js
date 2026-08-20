import { getLastActivitiesView, getExtractHref, applyActivitiesShortcutFilter } from "./view";
import { useActivitiesFilterStore } from "@/store/activitiesFilter";

describe("getLastActivitiesView", () => {
  it("retorna loading quando loading é true", () => {
    expect(
      getLastActivitiesView({ loading: true, error: false, data: [] }),
    ).toBe("loading");
  });

  it("prioriza loading mesmo quando há error ou dados", () => {
    expect(
      getLastActivitiesView({
        loading: true,
        error: true,
        data: [{ id: 1 }],
      }),
    ).toBe("loading");
  });

  it("retorna error quando error é true e não está carregando", () => {
    expect(
      getLastActivitiesView({ loading: false, error: true, data: [] }),
    ).toBe("error");
  });

  it("retorna empty quando não há dados, loading nem error", () => {
    expect(
      getLastActivitiesView({ loading: false, error: false, data: [] }),
    ).toBe("empty");
  });

  it("retorna empty quando data é undefined", () => {
    expect(getLastActivitiesView({ loading: false, error: false })).toBe(
      "empty",
    );
  });

  it("retorna data quando há itens e não está em loading nem error", () => {
    expect(
      getLastActivitiesView({
        loading: false,
        error: false,
        data: [{ id: 1 }],
      }),
    ).toBe("data");
  });
});

describe("getExtractHref", () => {
  it("aponta para a tab Atividades quando parentId é omitido", () => {
    expect(getExtractHref()).toBe("/activities");
  });

  it("aponta para a tab Atividades quando parentId é informado", () => {
    expect(getExtractHref(1)).toBe("/activities");
  });
});

describe("applyActivitiesShortcutFilter", () => {
  beforeEach(() => {
    useActivitiesFilterStore.getState().reset();
  });

  it("no atalho da home limpa o filtro para a família", () => {
    useActivitiesFilterStore.getState().setParentId(2);

    applyActivitiesShortcutFilter();

    expect(useActivitiesFilterStore.getState().parentId).toBeNull();
  });

  it("no atalho do filho aplica o parentId no filtro", () => {
    applyActivitiesShortcutFilter(1);

    expect(useActivitiesFilterStore.getState().parentId).toBe(1);
  });
});
