import * as Linking from "expo-linking";
import { useTheme } from "styled-components/native";

import { Text } from "@/components/ui/text";
import { contactEmail } from "@/sdk/constants";
import * as S from "./styles";

const onPressSupport = () => {
  Linking.openURL(`mailto:${contactEmail}`);
};

export const Support = () => {
  const theme = useTheme();

  return (
    <S.Support>
      <Text fontSize="sm" color={theme.colors.teal} textAlign="center">
        Não tem uma conta ou está com problemas para entrar?
      </Text>
      <Text
        fontSize="sm"
        color={theme.colors.teal}
        decoration="underline"
        textAlign="center"
        onPress={onPressSupport}
      >
        Fale com a GiftPay
      </Text>
    </S.Support>
  );
};
