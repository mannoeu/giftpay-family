import styled, { css } from "styled-components/native";
import { Text } from "@/components/ui/text";

export const getButtonTextColor = (variant, theme) => {
  const colors = {
    default: theme.colors.primaryForeground,
    destructive: theme.colors.destructiveForeground,
    outline: theme.colors.primary,
    secondary: theme.colors.secondaryForeground,
    ghost: theme.colors.primary,
    link: theme.colors.primary,
  };

  return colors[variant] || colors.default;
};

const buttonVariants = {
  default: css`
    background-color: ${({ theme }) => theme.colors.primary};
    border: 1px solid ${({ theme }) => theme.colors.primary};
  `,
  destructive: css`
    background-color: ${({ theme }) => theme.colors.destructive};
    border: 1px solid ${({ theme }) => theme.colors.destructive};
  `,
  outline: css`
    background-color: ${({ theme }) => theme.colors.background};
    border: 1px solid ${({ theme }) => theme.colors.input};
  `,
  secondary: css`
    background-color: ${({ theme }) => theme.colors.secondary};
    border: 1px solid ${({ theme }) => theme.colors.secondary};
  `,
  ghost: css`
    background-color: transparent;
  `,
  link: css`
    color: ${({ theme }) => theme.colors.primary};
    text-decoration-line: underline;
  `,
};

const buttonSizes = {
  default: css`
    padding: 8px 16px;
  `,
  sm: css`
    padding: 6px 12px;
  `,
  lg: css`
    padding: 12px 20px;
  `,
  icon: css`
    width: 36px;
    height: 36px;
    justify-content: center;
    align-items: center;
  `,
};

export const Container = styled.TouchableOpacity.attrs({
  activeOpacity: 0.8,
})`
  flex-direction: row;
  align-items: center;
  gap: 8px;
  justify-content: center;
  white-space: nowrap;
  border-radius: ${({ theme }) => theme.borderRadius.md};
  font-size: ${({ theme }) => theme.fontSize.sm};
  font-weight: 500;
  opacity: ${({ disabled }) => (disabled ? 0.5 : 1)};
  transition: color 0.15s background-color 0.15s, border-color 0.15s;
  position: relative;

  color: ${({ variant, theme }) => getButtonTextColor(variant, theme)};
  ${({ variant }) => buttonVariants[variant || "default"]};
  ${({ size }) => buttonSizes[size || "default"]};
`;

export const Loader = styled.ActivityIndicator.attrs(({ variant, theme }) => ({
  color: getButtonTextColor(variant, theme),
}))`
  width: ${({ theme }) => theme.fontSize.md};
  height: ${({ theme }) => theme.fontSize.md};

  position: absolute;
`;

export const ButtonText = styled(Text)`
  opacity: ${({ loading }) => (loading ? 0 : 1)};
  color: ${({ variant, theme }) => getButtonTextColor(variant, theme)};
  text-decoration: ${({ variant }) => variant === "link" && "underline"};
`;
