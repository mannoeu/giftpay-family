import { useTheme } from "styled-components/native";

import { Button } from "@/components/ui/button";
import { Text } from "@/components/ui/text";
import { UserAvatarButton } from "@/components/ui/userAvatar";
import { FAMILY_FILTER_ID } from "@/screenComponents/activities/view";
import { useActivitiesFilter } from "@/hooks/useActivitiesFilter";
import { useSheet } from "@/store/sheet";

import * as S from "./styles";

export const ActivitiesFilterSheet = ({
  dependents = [],
  selectedParentId = FAMILY_FILTER_ID,
  onFilter,
}) => {
  const theme = useTheme();
  const closeSheet = useSheet((state) => state.closeSheet);
  const { setPendingParentId, confirm, isSelected } =
    useActivitiesFilter(selectedParentId);

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
          De quem você deseja visualizar as atividades?
        </Text>
      </S.Header>

      <S.AvatarsScroll>
        <UserAvatarButton
          name="Família"
          label="Todos"
          selected={isSelected(FAMILY_FILTER_ID)}
          onPress={() => setPendingParentId(FAMILY_FILTER_ID)}
        />
        {dependents.map((dependent) => (
          <UserAvatarButton
            key={dependent.id}
            name={dependent.name}
            color={dependent.color}
            selected={isSelected(dependent.id)}
            onPress={() => setPendingParentId(dependent.id)}
          />
        ))}
      </S.AvatarsScroll>

      <Button size="lg" onPress={handleConfirm}>
        Filtrar
      </Button>
    </S.Container>
  );
};
