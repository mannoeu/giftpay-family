import { useTheme } from "styled-components/native";

import { useUserQuery } from "@/queries/user";
import { Text } from "@/components/ui/text";
import { getFirstName } from "@/sdk/user";
import * as S from "./styles";

export const Header = () => {
  const theme = useTheme();
  const { data: user } = useUserQuery();
  const firstName = getFirstName(user);

  return (
    <S.Header>
      <S.Greeting>
        <Text fontSize="xl" fontWeight="bold">
          {firstName ? "Bem vindo(a), " : "Bem vindo(a)!"}
        </Text>
        {!!firstName && (
          <Text fontSize="xl" fontWeight="bold" color={theme.colors.teal}>
            {firstName}!
          </Text>
        )}
      </S.Greeting>
      <Text color={theme.colors.stone}>
        Este é o seu primeiro acesso. Por segurança, defina uma nova senha para
        continuar.
      </Text>
    </S.Header>
  );
};
