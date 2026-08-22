import styled from "styled-components/native";

import { DEFAULT_PADDING } from "@/components/layout-constants";

export const List = styled.FlatList.attrs(
  ({ theme, $paddingBottom }) => ({
    showsVerticalScrollIndicator: false,
    keyboardShouldPersistTaps: "handled",
    contentContainerStyle: {
      flexGrow: 1,
      gap: 12,
      paddingHorizontal: DEFAULT_PADDING,
      paddingTop: 16,
      paddingBottom: $paddingBottom ?? 32,
      backgroundColor: theme.colors.cream,
    },
  }),
)`
  flex: 1;
  background-color: ${({ theme }) => theme.colors.cream};
`;

export const ItemCard = styled.View`
  background-color: ${({ theme }) => theme.colors.white};
  border-radius: 16px;
  padding: 4px 16px;
`;

export const PressableRow = styled.TouchableOpacity.attrs({
  activeOpacity: 0.75,
})`
  flex-direction: row;
  align-items: center;
`;

export const TransactionWrap = styled.View`
  flex: 1;
`;

export const SkeletonList = styled.ScrollView.attrs((p) => ({
  scrollEnabled: false,
  showsVerticalScrollIndicator: false,
  testID: "deposits-skeleton-list",
  contentContainerStyle: {
    ...p.contentContainerStyle,
    gap: 12,
    paddingHorizontal: DEFAULT_PADDING,
    paddingTop: 16,
  },
}))`
  flex: 1;
`;

export const EmptyState = styled.View`
  flex: 1;
  align-items: center;
  justify-content: center;
  padding: 32px 8px;
  gap: 8px;
`;

export const EmptyImage = styled.Image.attrs({
  resizeMode: "contain",
})`
  width: 168px;
  height: 112px;
  margin-top: 8px;
`;

export const ErrorState = styled.View`
  flex: 1;
  align-items: center;
  justify-content: center;
  padding: 32px 8px;
  gap: 16px;
`;
