import { takeLastActivities } from "./lastActivities";

describe("takeLastActivities", () => {
  it("devolve no máximo 5 itens", () => {
    const items = Array.from({ length: 6 }, (_, index) => ({ id: index + 1 }));

    expect(takeLastActivities(items).map((item) => item.id)).toEqual([
      1, 2, 3, 4, 5,
    ]);
  });

  it("devolve a lista inteira quando há 5 ou menos itens", () => {
    expect(takeLastActivities([{ id: 1 }, { id: 2 }])).toEqual([
      { id: 1 },
      { id: 2 },
    ]);
  });

  it("devolve lista vazia quando data é undefined", () => {
    expect(takeLastActivities()).toEqual([]);
  });
});
