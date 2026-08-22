import { ThemeProvider } from "styled-components/native";
import { render } from "@testing-library/react-native";

import { DEPOSITS_PAGE_SIZE } from "@/queries/deposits";
import { theme } from "@/theme";

import { DepositsLoadingList } from "./index";

describe("DepositsLoadingList", () => {
  it("renderiza um skeleton por item da página e não permite scroll", async () => {
    const { getAllByTestId, getByTestId } = await render(
      <ThemeProvider theme={theme}>
        <DepositsLoadingList />
      </ThemeProvider>,
    );

    expect(getAllByTestId("deposit-skeleton")).toHaveLength(DEPOSITS_PAGE_SIZE);
    expect(getByTestId("deposits-skeleton-list").props.scrollEnabled).toBe(
      false,
    );
  });
});
