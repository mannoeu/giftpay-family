import { useTheme } from "styled-components/native";

import { Text } from "@/components/ui/text";
import { SearchIcon } from "lucide-react-native";

import * as S from "./styles";

export function FlatListEmpty({ image, title, subtitle, children, ...rest }) {
  const theme = useTheme();

  return (
    <S.Container {...rest}>
      <SearchIcon color={theme.colors.mutedForeground} size={32} />
      <Text fontWeight="bold" fontSize="md" textAlign="center">
        {title}
      </Text>
      <Text
        fontSize="sm"
        textAlign="center"
        color={theme.colors.mutedForeground}
      >
        {subtitle}
      </Text>
    </S.Container>
  );
}
