import { useTheme } from "styled-components/native";

import { Text } from "@/components/ui/text";
import { Card } from "@/components/ui/card";
import { DependentWallet } from "@/components/dependentWallet";

import * as S from "./styles";

export const FamilyWallet = () => {
  const theme = useTheme();

  return (
    <Card>
      <S.Header>
        <Text fontSize="sm" color={theme.colors.stone}>
          Saldo da família
        </Text>
        <Text fontSize="xxl" fontWeight="bold">
          R$ 300,00
        </Text>
      </S.Header>
      <DependentWallet />
    </Card>
  );
};
