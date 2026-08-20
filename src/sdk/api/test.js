import {
  buildPaginatedResponse,
  getNextPageParam,
  getPreviousPageParam,
} from "./index";

describe("buildPaginatedResponse", () => {
  const items = Array.from({ length: 25 }, (_, index) => ({ id: index + 1 }));

  it("devolve a primeira página com next apontando para a segunda", () => {
    const page = buildPaginatedResponse(items, { page: 1, pageSize: 10 });

    expect(page.count).toBe(25);
    expect(page.results.map((item) => item.id)).toEqual([
      1, 2, 3, 4, 5, 6, 7, 8, 9, 10,
    ]);
    expect(page.previous).toBeNull();
    expect(getNextPageParam(page)).toBe(2);
  });

  it("devolve a última página sem next", () => {
    const page = buildPaginatedResponse(items, { page: 3, pageSize: 10 });

    expect(page.results.map((item) => item.id)).toEqual([21, 22, 23, 24, 25]);
    expect(getNextPageParam(page)).toBeUndefined();
    expect(getPreviousPageParam(page)).toBe(2);
  });

  it("trata lista vazia sem next nem previous", () => {
    const page = buildPaginatedResponse([], { page: 1, pageSize: 10 });

    expect(page).toEqual({
      count: 0,
      next: null,
      previous: null,
      results: [],
    });
  });
});
