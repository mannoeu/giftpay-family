import { useTheme } from "styled-components/native";

import { Button } from "@/components/ui/button";
import { Text } from "@/components/ui/text";
import { contactEmail } from "@/sdk/constants";
import { openSupportEmail } from "@/sdk/support";
import { useSheet } from "@/store/sheet";
import * as S from "./styles";

export const SupportSheet = () => {
  const theme = useTheme();
  const closeSheet = useSheet((state) => state.closeSheet);

  const handleSendEmail = () => {
    openSupportEmail();
    closeSheet();
  };

  return (
    <S.Container>
      <Text fontSize="xl" fontWeight="bold">
        Fale com o suporte
      </Text>
      <Text color={theme.colors.stone}>
        Para entrar em contato com o suporte, envie um e-mail para{" "}
        <Text fontWeight="semibold" color={theme.colors.teal}>
          {contactEmail}
        </Text>
        . O nosso time o ajudará com o seu caso.
      </Text>
      <Text color={theme.colors.stone}>
        A resposta será enviada em até 24h do recebimento do e-mail.
      </Text>
      <Button size="lg" onPress={handleSendEmail}>
        Enviar e-mail
      </Button>
    </S.Container>
  );
};
