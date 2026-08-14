import { ActivityIndicator } from "react-native";
import { useTheme } from "styled-components/native";

import * as S from "./styles";

export const FlatListFooter = ({ isLoading = false }) => {
  const theme = useTheme();

  return (
    <S.Container>
      {isLoading && (
        <ActivityIndicator size="large" color={theme.colors.teal} />
      )}
    </S.Container>
  );
};
