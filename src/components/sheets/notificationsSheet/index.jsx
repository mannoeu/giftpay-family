import { useState } from "react";
import { useTheme } from "styled-components/native";

import { InfoComponent } from "@/components/infoComponent";
import { Radio } from "@/components/ui/radio";
import { Separator } from "@/components/ui/separator";
import { Text } from "@/components/ui/text";
import { usePushNotificationPreference } from "@/hooks/usePushNotificationPreference";
import { openPushNotificationSettings } from "@/sdk/push-notification";

import * as S from "./styles";

const RADIO_OPTIONS = [
  { value: "enabled", label: "Ativadas" },
  { value: "disabled", label: "Desativadas" },
];

export const NotificationsSheet = () => {
  const theme = useTheme();
  const { isActive, isLoading, setEnabled } = usePushNotificationPreference();

  const [pending, setPending] = useState(false);

  const radioValue = isActive ? "enabled" : "disabled";

  const handleChange = async (value) => {
    if (pending || isLoading) return;

    const enable = value === "enabled";

    if (enable === isActive) return;

    setPending(true);
    try {
      const result = await setEnabled(enable);
      if (enable && result?.openedSettings) {
        openPushNotificationSettings();
      }
    } finally {
      setPending(false);
    }
  };

  return (
    <S.Container>
      <S.Header>
        <Text fontSize="xl" fontWeight="bold">
          Notificações
        </Text>
        <Text color={theme.colors.stone}>
          Gerencie o recebimento de notificações do GiftPay Família.
        </Text>
      </S.Header>

      <Radio
        options={RADIO_OPTIONS}
        value={radioValue}
        onChange={handleChange}
      />

      {isActive ? (
        <InfoComponent variant="info">
          Você receberá atualizações sobre todas as transações realizadas por
          seus dependentes.
        </InfoComponent>
      ) : (
        <InfoComponent variant="warning">
          Com as notificações desativadas, você não será alertada sobre novas
          transações realizadas por seus dependentes.
        </InfoComponent>
      )}
    </S.Container>
  );
};
