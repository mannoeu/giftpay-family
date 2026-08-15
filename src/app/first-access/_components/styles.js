import styled from "styled-components/native";
import { DEFAULT_PADDING } from "@/components/layout-constants";

export const Container = styled.View`
  flex-grow: 1;
  width: 100%;
  background-color: ${({ theme }) => theme.colors.cream};
  padding: 24px ${DEFAULT_PADDING}px;
  gap: 24px;
`;

export const Header = styled.View`
  flex-direction: column;
  gap: 8px;
`;

export const Greeting = styled.View`
  flex-direction: row;
  flex-wrap: wrap;
  align-items: baseline;
`;

export const Form = styled.View`
  flex-direction: column;
  gap: 12px;
  width: 100%;
`;

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

export const Actions = styled.View`
  margin-top: auto;
  padding-top: 16px;
  width: 100%;
`;
