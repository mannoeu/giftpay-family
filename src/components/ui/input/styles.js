import styled, { css } from "styled-components/native";
import { BottomSheetTextInput } from "@gorhom/bottom-sheet";

const sharedInputStyles = css`
  display: flex;
  height: ${({ multiline }) => (multiline ? "auto" : "48px")};
  min-height: ${({ multiline }) => (multiline ? "120px" : "48px")};
  width: 100%;
  border-radius: ${({ theme }) => theme.borderRadius.md};
  background-color: transparent;
  padding: ${({ multiline }) => (multiline ? "12px" : "4px 12px")};
  font-size: ${({ theme }) => theme.fontSize.base};
  border: 1px
    ${({ theme, focused, editable }) =>
      [
        editable ? "solid" : "dashed",
        focused ? theme.colors.ring : theme.colors.border,
      ].join(" ")};
  opacity: ${({ disabled }) => (disabled ? 0.5 : 1)};
  transition: color 0.2s, background-color 0.2s, border-color 0.2s;
  color: ${({ theme, editable }) =>
    editable ? theme.colors.foreground : theme.colors.mutedForeground};

  ::placeholder {
    color: ${({ theme }) => theme.colors.mutedForeground};
  }
`;

export const Input = styled.TextInput.attrs(({ theme }) => ({
  placeholderTextColor: theme.colors.mutedForeground,
}))`
  ${sharedInputStyles}
`;

export const BottomSheetInput = styled(BottomSheetTextInput).attrs(
  ({ theme }) => ({
    placeholderTextColor: theme.colors.mutedForeground,
  })
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
