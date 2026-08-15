import styled from "styled-components/native";

export const Container = styled.View`
  flex-direction: ${({ $variant }) =>
    $variant === "inline" ? "row" : "column"};
  align-items: center;
  gap: ${({ $variant }) => ($variant === "inline" ? "10px" : "12px")};
`;

export const LogoMark = styled.View`
  width: ${({ $variant }) => ($variant === "inline" ? 44 : 56)}px;
  height: ${({ $variant }) => ($variant === "inline" ? 44 : 56)}px;
  border-radius: 16px;
  background-color: ${({ theme }) => theme.colors.teal};
  align-items: center;
  justify-content: center;
`;

export const Title = styled.View`
  flex-direction: row;
  flex-wrap: wrap;
  align-items: baseline;
  justify-content: ${({ $variant }) =>
    $variant === "inline" ? "flex-start" : "center"};
`;

export const Description = styled.View`
  max-width: 214px;
  margin: 0 auto;
`;
