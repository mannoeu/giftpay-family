import { useTheme } from "styled-components/native";

import { Button } from "@/components/ui/button";
import { Text } from "@/components/ui/text";
import { useDepositsFilter } from "@/hooks/useDepositsFilter";
import { DEPOSIT_FILTER_OPTIONS } from "@/screenComponents/deposits/view";
import { useSheet } from "@/store/sheet";

import * as S from "./styles";

export const DepositsFilterSheet = ({
  selectedStatus = null,
  onFilter,
}) => {
  const theme = useTheme();
  const closeSheet = useSheet((state) => state.closeSheet);
  const { setPendingStatus, confirm, isSelected } =
    useDepositsFilter(selectedStatus);

  const handleConfirm = () => {
    confirm({ onFilter, closeSheet });
  };

  return (
    <S.Container>
      <S.Header>
        <Text fontSize="xl" fontWeight="bold">
          Filtrar
        </Text>
        <Text color={theme.colors.stone}>
          Qual status você deseja visualizar?
        </Text>
      </S.Header>

      <S.Options>
        {DEPOSIT_FILTER_OPTIONS.map((option) => (
          <S.Option
            key={String(option.status)}
            $selected={isSelected(option.status)}
            onPress={() => setPendingStatus(option.status)}
            accessibilityRole="button"
          >
            <Text
              fontSize="sm"
              fontWeight={isSelected(option.status) ? "semibold" : "regular"}
              color={
                isSelected(option.status)
                  ? theme.colors.teal
                  : theme.colors.charcoal
              }
            >
              {option.label}
            </Text>
          </S.Option>
        ))}
      </S.Options>

      <Button size="lg" onPress={handleConfirm}>
        Filtrar
      </Button>
    </S.Container>
  );
};
