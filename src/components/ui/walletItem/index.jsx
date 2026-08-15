import { useTheme } from "styled-components/native";

import { Text } from "@/components/ui/text";

import * as S from "./styles";

export const WalletItem = ({
  icon: Icon,
  title,
  description,
  value,
  backgroundColor,
  foregroundColor,
  textColor,
  ...rest
}) => {
  const theme = useTheme();
  const resolvedTextColor = textColor ?? theme.colors.charcoal;

  return (
    <S.Container
      $backgroundColor={backgroundColor}
      $foregroundColor={foregroundColor}
      {...rest}
    >
      <S.Left>
        <S.IconCircle $foregroundColor={foregroundColor}>
          <Icon size={18} color={resolvedTextColor} />
        </S.IconCircle>
        <S.TextGroup>
          <Text fontSize="sm" fontWeight="semibold" color={resolvedTextColor}>
            {title}
          </Text>
          {description ? (
            <Text
              fontSize="xs"
              color={resolvedTextColor}
              style={{ opacity: 0.7 }}
            >
              {description}
            </Text>
          ) : null}
        </S.TextGroup>
      </S.Left>
      <Text fontSize="md" fontWeight="bold" color={resolvedTextColor}>
        {value}
      </Text>
    </S.Container>
  );
};
