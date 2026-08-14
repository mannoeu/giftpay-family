import { Text } from "@/components/ui/text";
import { useTheme } from "styled-components/native";

import * as S from "./styles";

export const Field = ({ label, error, description, component }) => {
  const theme = useTheme();

  return (
    <S.Container>
      {label && <Text fontWeight="bold">{label}</Text>}
      {component}
      {description && (
        <Text fontSize="sm" color={theme.colors.stone}>
          {description}
        </Text>
      )}
      {error && (
        <Text fontSize="sm" color={theme.colors.danger}>
          {error}
        </Text>
      )}
    </S.Container>
  );
};
