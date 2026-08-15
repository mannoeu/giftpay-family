import styled from "styled-components/native";

const variantColors = {
  info: {
    bg: "mint",
    border: "teal",
    icon: "teal",
  },
  warning: {
    bg: "gold",
    border: "gold",
    icon: "gold",
  },
  danger: {
    bg: "terracotta",
    border: "terracotta",
    icon: "terracotta",
  },
};

export const getVariantTokens = (variant) =>
  variantColors[variant] || variantColors.info;

export const Container = styled.View`
  flex-direction: row;
  align-items: flex-start;
  gap: 12px;
  padding: 12px 16px;
  border-radius: 12px;
  background-color: ${({ theme, variant }) => {
    const tokens = getVariantTokens(variant);
    return theme.colors.opacity(theme.colors[tokens.bg], 20);
  }};
  border-width: 1px;
  border-color: ${({ theme, variant }) => {
    const tokens = getVariantTokens(variant);
    return theme.colors.opacity(theme.colors[tokens.border], 30);
  }};
`;

export const IconWrapper = styled.View`
  margin-top: 2px;
`;
