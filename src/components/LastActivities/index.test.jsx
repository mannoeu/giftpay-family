import { QueryClientProvider } from "@tanstack/react-query";
import { ThemeProvider } from "styled-components/native";
import { fireEvent, render, waitFor, act } from "@testing-library/react-native";

import { theme } from "@/theme";
import { createTestQueryClient } from "@/test/queryClient";
import { TransactionController } from "@/controller";
import { Formatter } from "@/sdk/formatter";

import { LastActivities } from "./index";

jest.mock("expo-router", () => {
  const React = require("react");
  const { Text } = require("react-native");

  return {
    Link: ({ href, children }) =>
      React.createElement(Text, { href }, children),
  };
});

jest.mock("@/controller", () => ({
  TransactionController: {
    getTransactions: jest.fn(),
  },
}));

const renderLastActivities = (ui) => {
  const client = createTestQueryClient();

  return render(
    <QueryClientProvider client={client}>
      <ThemeProvider theme={theme}>{ui}</ThemeProvider>
    </QueryClientProvider>,
  );
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

describe("LastActivities", () => {
  beforeEach(() => {
    jest.useRealTimers();
    jest.clearAllMocks();
  });

  afterEach(() => {
    jest.useFakeTimers();
  });

  it("esconde a lista e o empty enquanto loading", async () => {
    TransactionController.getTransactions.mockReturnValue(new Promise(() => {}));

    const { getByText, queryByText } = await renderLastActivities(
      <LastActivities />,
    );

    expect(getByText("Últimas atividades")).toBeTruthy();
    expect(queryByText("Compra aprovada")).toBeNull();
    expect(queryByText("Nenhuma atividade encontrada")).toBeNull();
    expect(queryByText("Ver mais")).toBeNull();
  });

  it("exibe empty com a mensagem quando a família não tem dados", async () => {
    TransactionController.getTransactions.mockResolvedValue({ data: [] });

    const { getByText, queryByText } = await renderLastActivities(
      <LastActivities emptyMessage="Faça uma recarga para João usar seu cartão" />,
    );

    await waitFor(() =>
      expect(getByText("Nenhuma atividade encontrada")).toBeTruthy(),
    );
    expect(
      getByText("Faça uma recarga para João usar seu cartão"),
    ).toBeTruthy();
    expect(queryByText("Ver mais")).toBeNull();
    expect(TransactionController.getTransactions).toHaveBeenCalledWith({
      parentId: undefined,
    });
  });

  it("busca as transações do parentId quando informado", async () => {
    TransactionController.getTransactions.mockResolvedValue({ data: [] });

    await renderLastActivities(<LastActivities parentId={1} />);

    await waitFor(() =>
      expect(TransactionController.getTransactions).toHaveBeenCalledWith({
        parentId: 1,
      }),
    );
  });

  it("exibe retry e recarrega quando error", async () => {
    TransactionController.getTransactions
      .mockRejectedValueOnce(new Error("falha"))
      .mockResolvedValue({ data: [apiItem] });

    const { getByText, queryByText } = await renderLastActivities(
      <LastActivities />,
    );

    await waitFor(() =>
      expect(getByText("Não foi possível carregar as atividades")).toBeTruthy(),
    );
    expect(
      getByText(
        "Por favor, tente novamente. Caso o problema persista, contate o suporte.",
      ),
    ).toBeTruthy();
    expect(queryByText("Ver mais")).toBeNull();

    await act(async () => {
      fireEvent.press(getByText("Tentar novamente"));
    });

    await waitFor(() => expect(getByText("Compra aprovada")).toBeTruthy());
    expect(
      TransactionController.getTransactions.mock.calls.length,
    ).toBeGreaterThanOrEqual(2);
  });

  it("exibe as transações e o link Ver mais quando há dados", async () => {
    TransactionController.getTransactions.mockResolvedValue({
      data: [apiItem, rechargeItem],
    });

    const { getByText } = await renderLastActivities(
      <LastActivities />,
    );

    await waitFor(() => expect(getByText("Compra aprovada")).toBeTruthy());
    expect(getByText("Em Livraria XPTO")).toBeTruthy();
    expect(getByText("Recarga realizada")).toBeTruthy();
    expect(
      getByText(`-${Formatter.currency(15, { forcePositive: true })}`),
    ).toBeTruthy();
    expect(
      getByText(`+${Formatter.currency(50, { forcePositive: true })}`),
    ).toBeTruthy();
    expect(getByText("Ver mais")).toBeTruthy();
    expect(getByText("Ver mais").parent.props.href).toBe("/home/extrato");
  });

  it("aponta Ver mais para o extrato do dependente quando parentId é informado", async () => {
    TransactionController.getTransactions.mockResolvedValue({
      data: [apiItem],
    });

    const { getByText } = await renderLastActivities(
      <LastActivities parentId={1} />,
    );

    await waitFor(() => expect(getByText("Ver mais")).toBeTruthy());
    expect(getByText("Ver mais").parent.props.href).toBe(
      "/home/dependent/1/extrato",
    );
  });
});
