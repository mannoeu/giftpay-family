import styled from "styled-components/native";

export const Separator = styled.View`
  height: ${({ orientation }) => (orientation === "vertical" ? "100%" : "1px")};
  width: ${({ orientation }) => (orientation === "vertical" ? "1px" : "100%")};
  background-color: ${({ theme, color }) => color || theme.colors.mint};
`;
