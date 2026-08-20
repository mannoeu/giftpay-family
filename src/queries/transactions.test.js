import { QueryClientProvider } from "@tanstack/react-query";
import { renderHook, waitFor, act } from "@testing-library/react-native";

import { TransactionController } from "@/controller";
import { createTestQueryClient } from "@/test/queryClient";

import { QueryKeys } from "./@config";
import {
  TRANSACTIONS_PAGE_SIZE,
  flattenTransactionPages,
  useTransactionsInfiniteQuery,
} from "./transactions";

jest.mock("@/controller", () => ({
  TransactionController: {
    getTransactions: jest.fn(),
  },
}));

const wrapper = ({ children }) => {
  const client = createTestQueryClient();
  return <QueryClientProvider client={client}>{children}</QueryClientProvider>;
};

const apiItem = {
  id: 1,
  direction: "out",
  status: "approved",
  title: "Compra aprovada",
  subtitle: "Em Livraria XPTO",
  amount: "15.00",
  created_at: "2026-04-20T16:30:00.000Z",
  parent: { id: 1, name: "João", color: "#557FEA" },
};

const rechargeItem = {
  id: 2,
  direction: "in",
  status: "approved",
  title: "Recarga realizada",
  subtitle: "Carteira Lanche",
  amount: "50.00",
  created_at: "2026-04-20T16:30:00.000Z",
  parent: { id: 2, name: "Maria", color: "#C06990" },
};

const pageOf = (results, { next = null, previous = null, count } = {}) => ({
  count: count ?? results.length,
  next,
  previous,
  results,
});

describe("TRANSACTIONS_PAGE_SIZE", () => {
  it("pagina de 20 em 20 itens", () => {
    expect(TRANSACTIONS_PAGE_SIZE).toBe(20);
  });
});

describe("flattenTransactionPages", () => {
  it("concatena os results das páginas", () => {
    expect(
      flattenTransactionPages([
        { results: [{ id: 1 }] },
        { results: [{ id: 2 }, { id: 3 }] },
      ]),
    ).toEqual([{ id: 1 }, { id: 2 }, { id: 3 }]);
  });

  it("devolve lista vazia quando não há páginas", () => {
    expect(flattenTransactionPages()).toEqual([]);
  });
});

describe("useTransactionsInfiniteQuery", () => {
  beforeEach(() => {
    jest.useRealTimers();
    jest.clearAllMocks();
  });

  afterEach(() => {
    jest.useFakeTimers();
  });

  it("serializa a primeira página e expõe isReady", async () => {
    TransactionController.getTransactions.mockResolvedValue({
      data: pageOf([apiItem], { count: 1 }),
    });

    const { result } = await renderHook(() => useTransactionsInfiniteQuery(), {
      wrapper,
    });

    await waitFor(() => expect(result.current.isReady).toBe(true));

    expect(result.current.data).toEqual([
      expect.objectContaining({
        id: 1,
        title: "Compra aprovada",
        letter: "J",
        color: "#557FEA",
        value: 15,
      }),
    ]);
    expect(result.current.isEmpty).toBe(false);
    expect(result.current.queryKey).toEqual([
      QueryKeys.getTransactions,
      { parentId: null },
    ]);
    expect(TransactionController.getTransactions).toHaveBeenCalledWith({
      parentId: undefined,
      page: 1,
      pageSize: TRANSACTIONS_PAGE_SIZE,
    });
  });

  it("repassa parentId na busca e na query key", async () => {
    TransactionController.getTransactions.mockResolvedValue({
      data: pageOf([], { count: 0 }),
    });

    const { result } = await renderHook(
      () => useTransactionsInfiniteQuery({ parentId: 1 }),
      { wrapper },
    );

    await waitFor(() => expect(result.current.isReady).toBe(true));

    expect(result.current.queryKey).toEqual([
      QueryKeys.getTransactions,
      { parentId: 1 },
    ]);
    expect(TransactionController.getTransactions).toHaveBeenCalledWith({
      parentId: 1,
      page: 1,
      pageSize: TRANSACTIONS_PAGE_SIZE,
    });
  });

  it("marca isEmpty quando a primeira página não tem resultados", async () => {
    TransactionController.getTransactions.mockResolvedValue({
      data: pageOf([], { count: 0 }),
    });

    const { result } = await renderHook(() => useTransactionsInfiniteQuery(), {
      wrapper,
    });

    await waitFor(() => expect(result.current.isEmpty).toBe(true));
    expect(result.current.data).toEqual([]);
  });

  it("concatena a próxima página ao chamar fetchNextPage", async () => {
    TransactionController.getTransactions
      .mockResolvedValueOnce({
        data: pageOf([apiItem], {
          count: 2,
          next: "https://api.local/transactions?offset=10&limit=10",
        }),
      })
      .mockResolvedValueOnce({
        data: pageOf([rechargeItem], { count: 2 }),
      });

    const { result } = await renderHook(() => useTransactionsInfiniteQuery(), {
      wrapper,
    });

    await waitFor(() => expect(result.current.data).toHaveLength(1));

    await act(async () => {
      await result.current.fetchNextPage();
    });

    await waitFor(() => expect(result.current.data).toHaveLength(2));
    expect(result.current.data.map((item) => item.id)).toEqual([1, 2]);
    expect(TransactionController.getTransactions).toHaveBeenNthCalledWith(2, {
      parentId: undefined,
      page: 2,
      pageSize: TRANSACTIONS_PAGE_SIZE,
    });
  });

  it("no refresh limpa o cache e busca só a primeira página", async () => {
    const client = createTestQueryClient();
    const stableWrapper = ({ children }) => (
      <QueryClientProvider client={client}>{children}</QueryClientProvider>
    );

    TransactionController.getTransactions
      .mockResolvedValueOnce({
        data: pageOf([apiItem], {
          count: 2,
          next: "https://api.local/transactions?offset=10&limit=10",
        }),
      })
      .mockResolvedValueOnce({
        data: pageOf([rechargeItem], { count: 2 }),
      })
      .mockResolvedValueOnce({
        data: pageOf(
          [{ ...apiItem, title: "Compra atualizada" }],
          {
            count: 2,
            next: "https://api.local/transactions?offset=10&limit=10",
          },
        ),
      });

    const { result } = await renderHook(() => useTransactionsInfiniteQuery(), {
      wrapper: stableWrapper,
    });

    await waitFor(() => expect(result.current.data).toHaveLength(1));

    await act(async () => {
      await result.current.fetchNextPage();
    });

    await waitFor(() => expect(result.current.data).toHaveLength(2));
    expect(TransactionController.getTransactions).toHaveBeenCalledTimes(2);

    await act(async () => {
      await result.current.resetQueries();
    });

    await waitFor(() =>
      expect(result.current.data).toEqual([
        expect.objectContaining({ id: 1, title: "Compra atualizada" }),
      ]),
    );

    expect(TransactionController.getTransactions).toHaveBeenCalledTimes(3);
    expect(TransactionController.getTransactions).toHaveBeenLastCalledWith({
      parentId: undefined,
      page: 1,
      pageSize: TRANSACTIONS_PAGE_SIZE,
    });
    expect(
      client.getQueryData([QueryKeys.getTransactions, { parentId: null }])
        ?.pages,
    ).toHaveLength(1);
  });
});
