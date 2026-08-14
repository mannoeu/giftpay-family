import { useTheme } from "styled-components/native";
import { Gift } from "lucide-react-native";

import { Text } from "@/components/ui/text";
import * as S from "./styles";

export const Brand = () => {
  const theme = useTheme();

  return (
    <S.Brand>
      <S.LogoMark>
        <Gift size={28} color={theme.colors.white} strokeWidth={2} />
      </S.LogoMark>
      <S.Title>
        <Text fontSize="xxl" fontWeight="bold" textAlign="center">
          GiftPay{" "}
        </Text>
        <Text fontSize="xxl" textAlign="center">
          Família
        </Text>
      </S.Title>
      <S.Description>
        <Text
          fontSize="md"
          color={theme.colors.stone}
          textAlign="center"
        >
          O cartão dos seus filhos, sob o seu controle.
        </Text>
      </S.Description>
    </S.Brand>
  );
};
