import styled from "styled-components/native";
import ExpoCheckbox from "expo-checkbox";

export const Container = styled.View`
  flex-direction: row;
  gap: 8px;
  align-items: center;
  align-self: flex-start;
`;

export const CheckboxComponent = styled(ExpoCheckbox).attrs(
  ({ value, theme }) => ({
    color: value ? theme.colors.teal : undefined,
  }),
)`
  border-radius: 6px;
  background-color: ${({ theme }) => theme.colors.white};
  border-color: ${({ theme }) => theme.colors.mint};
  border-width: 1px;
  width: 20px;
  height: 20px;
`;
