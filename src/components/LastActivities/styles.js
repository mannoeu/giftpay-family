import styled from "styled-components/native";

export const Header = styled.View``;

export const Body = styled.View``;

export const Footer = styled.View`
  align-items: flex-end;
`;

export const EmptyState = styled.View`
  align-items: center;
  padding: 16px 8px 8px;
  gap: 8px;
`;

export const EmptyImage = styled.Image.attrs({
  resizeMode: "contain",
})`
  width: 168px;
  height: 112px;
`;

export const ErrorState = styled.View`
  align-items: center;
  padding: 24px 8px 8px;
  gap: 16px;
`;
