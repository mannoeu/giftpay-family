import { useTheme } from "styled-components/native";

import { Skeleton } from "@/components/ui/skeleton";
import { Text } from "@/components/ui/text";
import { Formatter } from "@/sdk/formatter";
import {
  formatTransactionValue,
  getTransactionValueColorToken,
  resolveTransactionVariant,
  TransactionVariant,
} from "@/sdk/transaction";

import * as S from "./styles";

export const Transaction = ({
  variant = TransactionVariant.unknown,
  title,
  subtitle,
  createdAt,
  value,
  icon: Icon,
  letter,
  color,
  titleColor,
  valueColor: valueColorOverride,
  ...rest
}) => {
  const resolvedVariant = resolveTransactionVariant(variant);
  const theme = useTheme();
  const valueColor =
    valueColorOverride ??
    theme.colors[getTransactionValueColorToken(resolvedVariant)];

  return (
    <S.Container {...rest}>
      <S.IconCircle $color={color}>
        {Icon ? (
          <Icon size={18} color={theme.colors.white} />
        ) : letter ? (
          <S.Letter fontSize="sm">{letter?.charAt(0)?.toUpperCase()}</S.Letter>
        ) : null}
      </S.IconCircle>

      <S.TextGroup>
        <S.Title
          fontSize="sm"
          fontWeight="bold"
          color={titleColor}
          $color={titleColor}
        >
          {title}
        </S.Title>
        {subtitle ? (
          <Text fontSize="xs" color={theme.colors.stone}>
            {subtitle}
          </Text>
        ) : null}
        {createdAt ? (
          <Text fontSize="xs" color={theme.colors.grey}>
            {Formatter.getDateAndTimeString(createdAt)}
          </Text>
        ) : null}
      </S.TextGroup>

      <S.Value>
        <S.Amount
          fontSize="sm"
          fontWeight="semibold"
          color={valueColor}
          $color={valueColor}
        >
          {formatTransactionValue(value, resolvedVariant)}
        </S.Amount>
      </S.Value>
    </S.Container>
  );
};

export const TransactionSkeleton = () => (
  <S.Container>
    <Skeleton width={40} height={40} rounded="full" />
    <S.TextGroup>
      <Skeleton width="70%" height={14} rounded="4px" />
      <Skeleton width="50%" height={10} rounded="4px" />
      <Skeleton width="40%" height={10} rounded="4px" />
    </S.TextGroup>
    <Skeleton width={60} height={14} rounded="4px" />
  </S.Container>
);
