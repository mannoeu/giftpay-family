import { getDeposits } from "./deposit.controller";

describe("DepositController.getDeposits", () => {
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

  it("devolve a lista da família quando status não é informado", async () => {
    const res = await flushMock(getDeposits());

    expect(res.data.length).toBeGreaterThan(1);
    expect(new Set(res.data.map((item) => item.status))).toEqual(
      new Set(["pending", "paid"]),
    );
    expect(new Set(res.data.map((item) => item.parent.id)).size).toBeGreaterThan(
      1,
    );
  });

  it("filtra os depósitos pendentes", async () => {
    const res = await flushMock(getDeposits({ status: "pending" }));

    expect(res.data.length).toBeGreaterThan(0);
    expect(res.data.every((item) => item.status === "pending")).toBe(true);
  });

  it("aceita status como string paga", async () => {
    const res = await flushMock(getDeposits({ status: "paid" }));

    expect(res.data.length).toBeGreaterThan(0);
    expect(res.data.every((item) => item.status === "paid")).toBe(true);
  });

  it("pagina os resultados quando page é informado", async () => {
    const page1 = await flushMock(getDeposits({ page: 1, pageSize: 2 }));

    expect(page1.data.results).toHaveLength(2);
    expect(page1.data.count).toBeGreaterThan(2);
    expect(page1.data.previous).toBeNull();
    expect(page1.data.next).toContain("offset=2");
    expect(page1.data.next).toContain("limit=2");
  });

  it("filtra por status e pagina o recorte", async () => {
    const page1 = await flushMock(
      getDeposits({ status: "pending", page: 1, pageSize: 10 }),
    );

    expect(page1.data.results.length).toBeGreaterThan(0);
    expect(
      page1.data.results.every((item) => item.status === "pending"),
    ).toBe(true);
    expect(page1.data.count).toBeGreaterThanOrEqual(page1.data.results.length);
  });

  it("devolve página vazia quando o status não tem itens", async () => {
    const res = await flushMock(
      getDeposits({ status: "cancelled", page: 1, pageSize: 20 }),
    );

    expect(res.data.results).toEqual([]);
    expect(res.data.count).toBe(0);
    expect(res.data.next).toBeNull();
  });
});
