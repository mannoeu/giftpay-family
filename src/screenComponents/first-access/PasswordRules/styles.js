import styled from "styled-components/native";

export const Rules = styled.View`
  flex-direction: column;
  gap: 10px;
`;

export const RuleRow = styled.View`
  flex-direction: row;
  align-items: center;
  gap: 8px;
`;

export const RuleDot = styled.View`
  width: 14px;
  height: 14px;
  border-radius: 14px;
  background-color: ${({ theme, met }) =>
    met ? theme.colors.teal : theme.colors.opacity(theme.colors.stone, 28)};
  align-items: center;
  justify-content: center;
`;
