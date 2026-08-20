import { useActivitiesFilterStore } from "./activitiesFilter";

describe("useActivitiesFilterStore", () => {
  beforeEach(() => {
    useActivitiesFilterStore.getState().reset();
  });

  it("começa filtrando a família inteira", () => {
    expect(useActivitiesFilterStore.getState().parentId).toBeNull();
  });

  it("guarda o parentId selecionado", () => {
    useActivitiesFilterStore.getState().setParentId(1);

    expect(useActivitiesFilterStore.getState().parentId).toBe(1);
  });

  it("volta para a família ao resetar", () => {
    useActivitiesFilterStore.getState().setParentId(2);
    useActivitiesFilterStore.getState().reset();

    expect(useActivitiesFilterStore.getState().parentId).toBeNull();
  });

  it("normaliza parentId vindo da rota como string", () => {
    useActivitiesFilterStore.getState().setParentId("1");

    expect(useActivitiesFilterStore.getState().parentId).toBe(1);
  });
});
