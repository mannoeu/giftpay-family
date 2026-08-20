import { getTransactions } from "./transaction.controller";

describe("TransactionController.getTransactions", () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  const flushMock = async (promise) => {
    await jest.advanceTimersByTimeAsync(1500);
    return promise;
  };

  it("devolve a lista da família quando parentId não é informado", async () => {
    const res = await flushMock(getTransactions());

    expect(res.data.length).toBeGreaterThan(1);
    expect(new Set(res.data.map((item) => item.parent.id)).size).toBeGreaterThan(
      1,
    );
  });

  it("filtra as transações do parentId informado", async () => {
    const res = await flushMock(getTransactions({ parentId: 1 }));

    expect(res.data.length).toBeGreaterThan(0);
    expect(res.data.every((item) => item.parent.id === 1)).toBe(true);
  });

  it("aceita parentId como string", async () => {
    const res = await flushMock(getTransactions({ parentId: "1" }));

    expect(res.data.every((item) => item.parent.id === 1)).toBe(true);
  });

  it("pagina os resultados quando page é informado", async () => {
    const page1 = await flushMock(getTransactions({ page: 1, pageSize: 2 }));

    expect(page1.data.results).toHaveLength(2);
    expect(page1.data.count).toBeGreaterThan(2);
    expect(page1.data.previous).toBeNull();
    expect(page1.data.next).toContain("offset=2");
    expect(page1.data.next).toContain("limit=2");
  });

  it("filtra por parentId e pagina o recorte", async () => {
    const page1 = await flushMock(
      getTransactions({ parentId: 1, page: 1, pageSize: 10 }),
    );

    expect(page1.data.results.length).toBeGreaterThan(0);
    expect(
      page1.data.results.every((item) => item.parent.id === 1),
    ).toBe(true);
    expect(page1.data.count).toBeGreaterThanOrEqual(page1.data.results.length);
  });
});
