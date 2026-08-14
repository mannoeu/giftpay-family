import { useTheme } from "styled-components/native";
import { Gift } from "lucide-react-native";

import { Text } from "@/components/ui/text";
import * as S from "./styles";

export const Brand = () => {
  const theme = useTheme();

  return (
    <S.Brand>
      <S.LogoMark>
        <Gift size={20} color={theme.colors.white} strokeWidth={2} />
      </S.LogoMark>
      <S.Title>
        <Text fontSize="lg" fontWeight="bold">
          GiftPay{" "}
        </Text>
        <Text fontSize="lg">Família</Text>
      </S.Title>
    </S.Brand>
  );
};
