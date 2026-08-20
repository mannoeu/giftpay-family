import { act, renderHook, waitFor } from "@testing-library/react-native";
import { QueryClientProvider } from "@tanstack/react-query";

import { createTestQueryClient } from "@/test/queryClient";
import { TransactionController } from "@/controller";
import { TransactionVariant } from "@/sdk/transaction";

import { useLastActivitiesQuery } from "./lastActivities";

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

describe("useLastActivitiesQuery", () => {
  beforeEach(() => {
    jest.useRealTimers();
    jest.clearAllMocks();
    TransactionController.getTransactions.mockResolvedValue({ data: [] });
  });

  afterEach(() => {
    jest.useFakeTimers();
  });

  it("busca a lista da família quando parentId é omitido", async () => {
    const { result } = await renderHook(() => useLastActivitiesQuery(), {
      wrapper,
    });

    await waitFor(() => expect(result.current.isReady).toBe(true));

    expect(TransactionController.getTransactions).toHaveBeenCalledWith({
      parentId: undefined,
    });
    expect(result.current.data).toEqual([]);
  });

  it("busca as transações do parentId informado", async () => {
    const { result } = await renderHook(
      () => useLastActivitiesQuery({ parentId: 1 }),
      { wrapper },
    );

    await waitFor(() => expect(result.current.isReady).toBe(true));

    expect(TransactionController.getTransactions).toHaveBeenCalledWith({
      parentId: 1,
    });
  });

  it("isola o cache da família do cache de um parentId", async () => {
    const client = createTestQueryClient();
    const sharedWrapper = ({ children }) => (
      <QueryClientProvider client={client}>{children}</QueryClientProvider>
    );

    TransactionController.getTransactions
      .mockResolvedValueOnce({
        data: [{ ...apiItem, id: 10, title: "Atividade da família" }],
      })
      .mockResolvedValueOnce({
        data: [{ ...apiItem, id: 20, title: "Atividade do João" }],
      });

    const { result: family } = await renderHook(() => useLastActivitiesQuery(), {
      wrapper: sharedWrapper,
    });
    const { result: parent } = await renderHook(
      () => useLastActivitiesQuery({ parentId: 1 }),
      { wrapper: sharedWrapper },
    );

    await waitFor(() => expect(family.current.isReady).toBe(true));
    await waitFor(() => expect(parent.current.isReady).toBe(true));

    expect(family.current.data[0].title).toBe("Atividade da família");
    expect(parent.current.data[0].title).toBe("Atividade do João");
  });

  it("serializa o payload da API para o shape da UI", async () => {
    TransactionController.getTransactions.mockResolvedValue({
      data: [apiItem],
    });

    const { result } = await renderHook(() => useLastActivitiesQuery(), {
      wrapper,
    });

    await waitFor(() => expect(result.current.isReady).toBe(true));

    expect(result.current.data).toEqual([
      {
        id: 1,
        variant: TransactionVariant.out,
        title: "Compra aprovada",
        subtitle: "Em Livraria XPTO",
        created_at: "2026-04-20T16:30:00.000Z",
        value: 15,
        letter: "J",
        color: "#557FEA",
      },
    ]);
  });

  it("limita as últimas atividades a 5 itens", async () => {
    TransactionController.getTransactions.mockResolvedValue({
      data: Array.from({ length: 6 }, (_, index) => ({
        ...apiItem,
        id: index + 1,
        title: `Item ${index + 1}`,
      })),
    });

    const { result } = await renderHook(() => useLastActivitiesQuery(), {
      wrapper,
    });

    await waitFor(() => expect(result.current.isReady).toBe(true));

    expect(result.current.data).toHaveLength(5);
    expect(result.current.data.map((item) => item.title)).toEqual([
      "Item 1",
      "Item 2",
      "Item 3",
      "Item 4",
      "Item 5",
    ]);
  });
});
