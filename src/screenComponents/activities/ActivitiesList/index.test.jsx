import { ThemeProvider } from "styled-components/native";
import { render } from "@testing-library/react-native";

import { theme } from "@/theme";
import { TRANSACTIONS_PAGE_SIZE } from "@/queries/transactions";

import { ActivitiesLoadingList } from "./index";

describe("ActivitiesLoadingList", () => {
  it("renderiza um skeleton por item da página e não permite scroll", async () => {
    const { getAllByTestId, getByTestId } = await render(
      <ThemeProvider theme={theme}>
        <ActivitiesLoadingList />
      </ThemeProvider>,
    );

    expect(getAllByTestId("activity-skeleton")).toHaveLength(
      TRANSACTIONS_PAGE_SIZE,
    );
    expect(getByTestId("activities-skeleton-list").props.scrollEnabled).toBe(
      false,
    );
  });
});
