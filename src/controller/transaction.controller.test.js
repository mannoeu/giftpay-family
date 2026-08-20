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
});
