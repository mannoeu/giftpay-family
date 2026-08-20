import styled from "styled-components/native";

export const Container = styled.View`
  flex-direction: column;
  gap: 16px;
`;

export const Header = styled.View`
  flex-direction: column;
  gap: 4px;
`;

export const AvatarsScroll = styled.ScrollView.attrs((p) => ({
  ...p,
  horizontal: true,
  showsHorizontalScrollIndicator: false,
  contentContainerStyle: {
    ...p.contentContainerStyle,
    gap: 8,
    alignItems: "center",
  },
}))``;
