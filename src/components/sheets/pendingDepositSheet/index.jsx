import { Clock } from "lucide-react-native";
import { useTheme } from "styled-components/native";

import { Button } from "@/components/ui/button";
import { Text } from "@/components/ui/text";
import {
  copyPixCode,
  getDepositCreatedLabel,
  getDepositDestinationLabel,
} from "@/sdk/deposit";
import { Formatter } from "@/sdk/formatter";

import * as S from "./styles";

export const PendingDepositSheet = ({ deposit }) => {
  const theme = useTheme();

  const handleCopy = () => {
    copyPixCode(deposit?.pix_code);
  };

  return (
    <S.Container>
      <Text fontSize="xl" fontWeight="bold">
        Depósito
      </Text>

      <Text fontSize="xxl" fontWeight="bold" color={theme.colors.teal}>
        {Formatter.currency(deposit?.value)}
      </Text>

      <S.Meta>
        <Clock size={18} color={theme.colors.gold} />
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
        </S.MetaTexts>
      </S.Meta>

      <Text fontSize="sm" color={theme.colors.charcoal}>
        Utilize o código para depositar usando Pix.
      </Text>

      <S.PixBox>
        <Text fontSize="xs" color={theme.colors.charcoal} selectable>
          {deposit?.pix_code}
        </Text>
      </S.PixBox>

      <Text fontSize="xs" color={theme.colors.stone}>
        Você pode acompanhar o status no menu Depósitos. Se já pagou, aguarde a
        compensação.
      </Text>

      <Button size="lg" onPress={handleCopy}>
        Copiar código
      </Button>
    </S.Container>
  );
};
