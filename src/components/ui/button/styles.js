import styled, { css } from "styled-components/native";
import { Text } from "@/components/ui/text";

export const getButtonTextColor = (variant, theme) => {
  const colors = {
    default: theme.colors.white,
    destructive: theme.colors.white,
    outline: theme.colors.charcoal,
  };

  return colors[variant] || colors.default;
};

const buttonVariants = {
  default: css`
    background-color: ${({ theme }) => theme.colors.teal};
    border: 1px solid ${({ theme }) => theme.colors.mint};
  `,
  destructive: css`
    background-color: ${({ theme }) => theme.colors.danger};
    border: 1px solid ${({ theme }) => theme.colors.danger_border};
  `,
  outline: css`
    background-color: ${({ theme }) => theme.colors.white};
    border: 1px solid ${({ theme }) => theme.colors.mint};
  `,
};

const buttonSizes = {
  default: css`
    padding: 8px 16px;
  `,
  sm: css`
    padding: 16px 12px;
  `,
  lg: css`
    padding: 20px 16px;
  `,
  icon: css`
    width: 48px;
    height: 48px;
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
  border-radius: 16px;
  font-size: ${({ theme }) => theme.fontSize.sm};
  opacity: ${({ disabled }) => (disabled ? 0.5 : 1)};
  transition:
    color 0.15s background-color 0.15s,
    border-color 0.15s;
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
`;
