import { ThemeProvider } from "styled-components/native";
import { render } from "@testing-library/react-native";

import { theme } from "@/theme";

import { DepositsHeader } from "./index";

const renderHeader = (props) =>
  render(
    <ThemeProvider theme={theme}>
      <DepositsHeader filterLabel="Filtrar: Todos" {...props} />
    </ThemeProvider>,
  );

describe("DepositsHeader", () => {
  it("esconde a bolinha quando o filtro está inativo", async () => {
    const { queryByTestId } = await renderHeader({ isFilterActive: false });

    expect(queryByTestId("deposits-filter-dot")).toBeNull();
  });

  it("mostra a bolinha vermelha ao lado do ícone quando o filtro está ativo", async () => {
    const { getByTestId } = await renderHeader({
      filterLabel: "Filtrar: Pago",
      isFilterActive: true,
    });

    expect(getByTestId("deposits-filter-dot")).toBeTruthy();
  });
});
