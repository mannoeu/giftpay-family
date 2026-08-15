import styled from "styled-components/native";

export const Container = styled.View`
  flex: 1;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  background-color: ${({ $backgroundColor, theme }) =>
    $backgroundColor ?? theme.colors.white};
  border: 1px solid
    ${({ theme, $backgroundColor }) => $backgroundColor ?? theme.colors.mint};
  border-radius: 999px;
  padding: 8px 16px 8px 8px;
  gap: 16px;
`;

export const Left = styled.View`
  flex-direction: row;
  align-items: center;
  gap: 8px;
  flex: 1;
`;

export const IconCircle = styled.View`
  width: 40px;
  height: 40px;
  border-radius: 40px;
  background-color: ${({ $foregroundColor, theme }) =>
    $foregroundColor ?? theme.colors.cream};
  align-items: center;
  justify-content: center;
`;

export const TextGroup = styled.View`
  flex: 1;
`;
