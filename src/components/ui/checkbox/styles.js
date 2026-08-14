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
  })
)`
  width: ${({ theme }) => theme.fontSize.base};
  height: ${({ theme }) => theme.fontSize.base};
`;
