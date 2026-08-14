import { Text } from "@/components/ui/text";
import { useTheme } from "styled-components/native";

import * as S from "./styles";

export const Field = ({ label, error, description, component }) => {
  const theme = useTheme();

  return (
    <S.Container>
      {label && <Text fontWeight="bold">{label}</Text>}
      {component}
      {error && (
        <Text fontSize="sm" color={theme.colors.red_600}>
          {error}
        </Text>
      )}
      {description && (
        <Text fontSize="xs" color={theme.colors.mutedForeground}>
          {description}
        </Text>
      )}
    </S.Container>
  );
};
