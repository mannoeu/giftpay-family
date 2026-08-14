import styled from "styled-components/native";
import { DEFAULT_PADDING } from "@/components/layout-constants";
import { Input } from "@/components/ui/input";

export const Container = styled.ScrollView.attrs(({ theme }) => ({
  keyboardShouldPersistTaps: "handled",
  alwaysBounceVertical: false,
  contentContainerStyle: {
    flexGrow: 1,
    backgroundColor: theme.colors.background,
    paddingHorizontal: DEFAULT_PADDING,
    paddingVertical: 24,
    gap: 24,
  },
}))`
  flex: 1;
  width: 100%;
`;

export const Brand = styled.View`
  flex-direction: row;
  align-items: center;
  gap: 10px;
`;

export const LogoMark = styled.View`
  width: 40px;
  height: 40px;
  border-radius: ${({ theme }) => theme.borderRadius.xl};
  background-color: ${({ theme }) => theme.colors.teal};
  align-items: center;
  justify-content: center;
`;

export const Title = styled.View`
  flex-direction: row;
  flex-wrap: wrap;
  align-items: baseline;
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

export const PasswordInput = styled(Input)`
  background-color: ${({ theme }) => theme.colors.white};
`;

export const Rules = styled.View`
  flex-direction: column;
  gap: 10px;
`;

export const RuleRow = styled.View`
  flex-direction: row;
  align-items: center;
  gap: 10px;
`;

export const RuleDot = styled.View`
  width: 18px;
  height: 18px;
  border-radius: ${({ theme }) => theme.borderRadius.full};
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
