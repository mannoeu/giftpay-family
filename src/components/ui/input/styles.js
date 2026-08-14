import styled, { css } from "styled-components/native";
import { BottomSheetTextInput } from "@gorhom/bottom-sheet";

const sharedInputStyles = css`
  display: flex;
  height: ${({ multiline }) => (multiline ? "auto" : "58px")};
  min-height: ${({ multiline }) => (multiline ? "120px" : "58px")};
  width: 100%;
  border-radius: 16px;
  background-color: ${({ theme }) => theme.colors.white};
  padding: ${({ multiline }) => (multiline ? "14px" : "4px 14px")};
  font-size: ${({ theme }) => theme.fontSize.base};
  border: 1px
    ${({ theme, focused, editable }) =>
      [
        editable ? "solid" : "dashed",
        focused ? theme.colors.teal : theme.colors.mint,
      ].join(" ")};
  opacity: ${({ disabled }) => (disabled ? 0.7 : 1)};
  transition:
    color 0.2s,
    background-color 0.2s,
    border-color 0.2s;
  color: ${({ theme, editable }) =>
    editable ? theme.colors.charcoal : theme.colors.stone};

  ::placeholder {
    color: ${({ theme }) => theme.colors.stone};
  }
`;

export const Input = styled.TextInput.attrs(({ theme }) => ({
  placeholderTextColor: theme.colors.stone,
}))`
  ${sharedInputStyles}
`;

export const BottomSheetInput = styled(BottomSheetTextInput).attrs(
  ({ theme }) => ({
    placeholderTextColor: theme.colors.stone,
  }),
)`
  ${sharedInputStyles}
`;

export const Container = styled.View`
  gap: 8px;
  flex-shrink: 1;
`;

export const ShowPasswordControl = styled.View`
  align-self: flex-start;
  gap: 4px;
`;
