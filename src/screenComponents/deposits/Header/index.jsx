import { Funnel } from "lucide-react-native";
import { useTheme } from "styled-components/native";

import { Text } from "@/components/ui/text";

import * as S from "./styles";

export const DepositsHeader = ({
  filterLabel,
  onPressFilter,
  isFilterActive = false,
}) => {
  const theme = useTheme();

  return (
    <S.Container>
      <S.Title>
        <Text fontSize="xl" fontWeight="bold">
          Depósitos
        </Text>
      </S.Title>
      <S.FilterButton onPress={onPressFilter} accessibilityRole="button">
        <S.FilterIconWrap>
          <Funnel size={16} color={theme.colors.teal} />
          {isFilterActive ? (
            <S.FilterDot testID="deposits-filter-dot" />
          ) : null}
        </S.FilterIconWrap>
        <Text fontSize="sm" numberOfLines={1}>
          {filterLabel}
        </Text>
      </S.FilterButton>
    </S.Container>
  );
};
