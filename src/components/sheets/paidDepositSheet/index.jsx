import { CheckCircleIcon } from "lucide-react-native";
import { useTheme } from "styled-components/native";

import { Button } from "@/components/ui/button";
import { Text } from "@/components/ui/text";
import {
  getDepositCreatedLabel,
  getDepositDestinationLabel,
  getDepositPaidLabel,
} from "@/sdk/deposit";
import { Formatter } from "@/sdk/formatter";
import { useSheet } from "@/store/sheet";
import depositPaidImage from "@/assets/images/deposit-paid.png";

import * as S from "./styles";

export const PaidDepositSheet = ({ deposit }) => {
  const theme = useTheme();
  const closeSheet = useSheet((state) => state.closeSheet);

  return (
    <S.Container>
      <Text fontSize="xl" fontWeight="bold">
        Depósito
      </Text>

      <Text fontSize="xxl" fontWeight="bold" color={theme.colors.teal}>
        {Formatter.currency(deposit?.value)}
      </Text>

      <S.Meta>
        <CheckCircleIcon size={18} color={theme.colors.teal} />
        <S.MetaTexts>
          <Text fontSize="sm" color={theme.colors.stone}>
            {getDepositDestinationLabel({
              walletName: deposit?.walletName,
              parentName: deposit?.parentName,
            })}
          </Text>
          <Text fontSize="sm" color={theme.colors.stone}>
            {getDepositCreatedLabel(deposit?.created_at)}
          </Text>
          {deposit?.paid_at ? (
            <Text fontSize="sm" color={theme.colors.stone}>
              {getDepositPaidLabel(deposit.paid_at)}
            </Text>
          ) : null}
        </S.MetaTexts>
      </S.Meta>

      <S.Image source={depositPaidImage} />

      <Button size="lg" onPress={closeSheet}>
        Entendi
      </Button>
    </S.Container>
  );
};
