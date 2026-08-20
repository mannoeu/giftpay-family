import { ThemeProvider } from "styled-components/native";
import { render } from "@testing-library/react-native";

import { theme } from "@/theme";

import { ActivitiesHeader } from "./index";

const renderHeader = (props) =>
  render(
    <ThemeProvider theme={theme}>
      <ActivitiesHeader filterLabel="Filtrar: Todos" {...props} />
    </ThemeProvider>,
  );

describe("ActivitiesHeader", () => {
  it("esconde a bolinha quando o filtro está inativo", async () => {
    const { queryByTestId } = await renderHeader({ isFilterActive: false });

    expect(queryByTestId("activities-filter-dot")).toBeNull();
  });

  it("mostra a bolinha vermelha ao lado do ícone quando o filtro está ativo", async () => {
    const { getByTestId } = await renderHeader({
      filterLabel: "Filtrar: João",
      isFilterActive: true,
    });

    expect(getByTestId("activities-filter-dot")).toBeTruthy();
  });
});
