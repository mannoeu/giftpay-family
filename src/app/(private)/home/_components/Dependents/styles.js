import styled from "styled-components/native";

import { DEFAULT_PADDING } from "@/components/layout-constants";

export const Container = styled.View``;

export const HorizontalScroll = styled.ScrollView.attrs((p) => ({
  ...p,
  horizontal: true,
  showsHorizontalScrollIndicator: false,
  contentContainerStyle: {
    ...p.contentContainerStyle,
    gap: 8,
    alignItems: "center",
    paddingHorizontal: DEFAULT_PADDING,
  },
}))``;

export const SkeletonContainer = styled.View`
  flex-direction: row;
  gap: 8px;
  padding-horizontal: ${DEFAULT_PADDING}px;
`;
