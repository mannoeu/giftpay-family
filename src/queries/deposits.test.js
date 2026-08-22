import { QueryClientProvider } from "@tanstack/react-query";
import { renderHook, waitFor, act } from "@testing-library/react-native";

import { DepositController } from "@/controller";
import { DepositStatus } from "@/sdk/deposit";
import { WalletEnum } from "@/sdk/wallet";
import { createTestQueryClient } from "@/test/queryClient";

import { QueryKeys } from "./@config";
import {
  DEPOSITS_PAGE_SIZE,
  flattenDepositPages,
  useDepositsInfiniteQuery,
} from "./deposits";

jest.mock("@/controller", () => ({
  DepositController: {
    getDeposits: jest.fn(),
  },
}));

const wrapper = ({ children }) => {
  const client = createTestQueryClient();
  return <QueryClientProvider client={client}>{children}</QueryClientProvider>;
};

const pendingItem = {
  id: 1,
  status: DepositStatus.pending,
  amount: "50.00",
  wallet: WalletEnum.meal,
  created_at: "2026-04-20T16:00:00.000Z",
  paid_at: null,
  pix_code: "00020126MOCKPIX",
  parent: { id: 1, name: "João", color: "#557FEA" },
};

const paidItem = {
  id: 2,
  status: DepositStatus.paid,
  amount: "50.00",
  wallet: WalletEnum.allowance,
  created_at: "2026-04-20T16:00:00.000Z",
  paid_at: "2026-04-20T16:02:00.000Z",
  pix_code: null,
  parent: { id: 2, name: "Maria", color: "#C06990" },
};

const pageOf = (results, { next = null, previous = null, count } = {}) => ({
  count: count ?? results.length,
  next,
  previous,
  results,
});

describe("DEPOSITS_PAGE_SIZE", () => {
  it("pagina de 20 em 20 itens", () => {
    expect(DEPOSITS_PAGE_SIZE).toBe(20);
  });
});

describe("flattenDepositPages", () => {
  it("concatena os results das páginas", () => {
    expect(
      flattenDepositPages([
        { results: [{ id: 1 }] },
        { results: [{ id: 2 }, { id: 3 }] },
      ]),
    ).toEqual([{ id: 1 }, { id: 2 }, { id: 3 }]);
  });

  it("devolve lista vazia quando não há páginas", () => {
    expect(flattenDepositPages()).toEqual([]);
  });
});

describe("useDepositsInfiniteQuery", () => {
  beforeEach(() => {
    jest.useRealTimers();
    jest.clearAllMocks();
  });

  afterEach(() => {
    jest.useFakeTimers();
  });

  it("serializa a primeira página e expõe isReady", async () => {
    DepositController.getDeposits.mockResolvedValue({
      data: pageOf([pendingItem], { count: 1 }),
    });

    const { result } = await renderHook(() => useDepositsInfiniteQuery(), {
      wrapper,
    });

    await waitFor(() => expect(result.current.isReady).toBe(true));

    expect(result.current.data).toEqual([
      expect.objectContaining({
        id: 1,
        title: "Pendente",
        subtitle: "Carteira Lanche",
        letter: "J",
        color: "#557FEA",
        value: 50,
        titleColorToken: "gold",
      }),
    ]);
    expect(result.current.isEmpty).toBe(false);
    expect(result.current.queryKey).toEqual([
      QueryKeys.getDeposits,
      { status: null },
    ]);
    expect(DepositController.getDeposits).toHaveBeenCalledWith({
      status: undefined,
      page: 1,
      pageSize: DEPOSITS_PAGE_SIZE,
    });
  });

  it("repassa status na busca e na query key", async () => {
    DepositController.getDeposits.mockResolvedValue({
      data: pageOf([paidItem], { count: 1 }),
    });

    const { result } = await renderHook(
      () => useDepositsInfiniteQuery({ status: DepositStatus.paid }),
      { wrapper },
    );

    await waitFor(() => expect(result.current.isReady).toBe(true));

    expect(result.current.queryKey).toEqual([
      QueryKeys.getDeposits,
      { status: DepositStatus.paid },
    ]);
    expect(result.current.data).toEqual([
      expect.objectContaining({
        id: 2,
        title: "Pago",
        subtitle: "Carteira Mesada",
        titleColorToken: "teal",
      }),
    ]);
    expect(DepositController.getDeposits).toHaveBeenCalledWith({
      status: DepositStatus.paid,
      page: 1,
      pageSize: DEPOSITS_PAGE_SIZE,
    });
  });

  it("marca isEmpty quando a primeira página não tem resultados", async () => {
    DepositController.getDeposits.mockResolvedValue({
      data: pageOf([], { count: 0 }),
    });

    const { result } = await renderHook(() => useDepositsInfiniteQuery(), {
      wrapper,
    });

    await waitFor(() => expect(result.current.isEmpty).toBe(true));
    expect(result.current.data).toEqual([]);
  });

  it("expõe isError quando o controller rejeita", async () => {
    DepositController.getDeposits.mockRejectedValue(new Error("fail"));

    const { result } = await renderHook(() => useDepositsInfiniteQuery(), {
      wrapper,
    });

    await waitFor(() => expect(result.current.isError).toBe(true));
    expect(result.current.isReady).toBe(false);
    expect(result.current.data).toEqual([]);
  });

  it("concatena a próxima página ao chamar fetchNextPage", async () => {
    DepositController.getDeposits
      .mockResolvedValueOnce({
        data: pageOf([pendingItem], {
          count: 2,
          next: "https://api.local/deposits?offset=10&limit=10",
        }),
      })
      .mockResolvedValueOnce({
        data: pageOf([paidItem], { count: 2 }),
      });

    const { result } = await renderHook(() => useDepositsInfiniteQuery(), {
      wrapper,
    });

    await waitFor(() => expect(result.current.data).toHaveLength(1));

    await act(async () => {
      await result.current.fetchNextPage();
    });

    await waitFor(() => expect(result.current.data).toHaveLength(2));
    expect(result.current.data.map((item) => item.id)).toEqual([1, 2]);
    expect(DepositController.getDeposits).toHaveBeenNthCalledWith(2, {
      status: undefined,
      page: 2,
      pageSize: DEPOSITS_PAGE_SIZE,
    });
  });
});
