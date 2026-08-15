import { useTheme } from "styled-components/native";
import { InfoIcon, AlertTriangleIcon, AlertCircleIcon } from "lucide-react-native";

import { Text } from "@/components/ui/text";

import * as S from "./styles";

const variantIcons = {
  info: InfoIcon,
  warning: AlertTriangleIcon,
  danger: AlertCircleIcon,
};

export const InfoComponent = ({ variant = "info", children }) => {
  const theme = useTheme();
  const tokens = S.getVariantTokens(variant);
  const Icon = variantIcons[variant] || InfoIcon;

  return (
    <S.Container variant={variant}>
      <S.IconWrapper>
        <Icon size={18} color={theme.colors[tokens.icon]} />
      </S.IconWrapper>
      <Text fontSize="sm" color={theme.colors.charcoal} style={{ flex: 1 }}>
        {children}
      </Text>
    </S.Container>
  );
};
