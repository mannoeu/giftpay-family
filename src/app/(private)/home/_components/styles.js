import styled from "styled-components/native";
import { DEFAULT_PADDING } from "@/components/layout-constants";

export const Container = styled.ScrollView.attrs(
  ({ theme, $paddingBottom }) => ({
    keyboardShouldPersistTaps: "handled",
    alwaysBounceVertical: false,
    contentContainerStyle: {
      flexGrow: 1,
      backgroundColor: theme.colors.cream,
      paddingHorizontal: DEFAULT_PADDING,
      paddingTop: 8,
      paddingBottom: $paddingBottom ?? 32,
      gap: 24,
    },
  }),
)`
  flex: 1;
  width: 100%;
  background-color: ${({ theme }) => theme.colors.cream};
`;
