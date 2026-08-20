import { useTheme } from "styled-components/native";

import { Text } from "@/components/ui/text";
import { SupportSheet } from "@/components/sheets/supportSheet";
import { useSheet } from "@/store/sheet";
import * as S from "./styles";

export const Support = () => {
  const theme = useTheme();
  const { openSheet } = useSheet();

  const openSupportSheet = () => {
    openSheet(<SupportSheet />);
  };

  return (
    <S.Support>
      <Text fontSize="sm" color={theme.colors.teal} textAlign="center">
        Não tem uma conta ou está com problemas para entrar?
      </Text>
      <S.SupportLink onPress={openSupportSheet}>
        <Text
          fontSize="sm"
          color={theme.colors.teal}
          decoration="underline"
          textAlign="center"
        >
          Fale com a GiftPay
        </Text>
      </S.SupportLink>
    </S.Support>
  );
};
