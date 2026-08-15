import { useState } from "react";
import { useTheme } from "styled-components/native";

import { BellIcon, BellRingIcon, CheckCircleIcon } from "lucide-react-native";

import { Button } from "@/components/ui/button";
import { Text } from "@/components/ui/text";
import {
  isPushNotificationSupported,
  requestPushNotificationPermission,
} from "@/sdk/push-notification";
import { ToastError } from "@/sdk/toast";
import { useSheet } from "@/store/sheet";

import * as S from "./styles";

const VARIANTS = {
  request: {
    Icon: BellIcon,
    title: "Fique por dentro de tudo",
    description:
      "Ative as notificações para receber avisos sobre seus presentes, pagamentos e novidades do GiftPay.",
    primaryLabel: "Permitir notificações",
    secondaryLabel: "Agora não",
  },
  success: {
    Icon: CheckCircleIcon,
    title: "Notificações ativadas!",
    description:
      "Ótimo! Você vai receber avisos sobre seus presentes e pagamentos.",
    primaryLabel: "Entendi",
    secondaryLabel: null,
  },
};

export const PermissionPromptSheet = () => {
  const theme = useTheme();
  const closeSheet = useSheet((state) => state.closeSheet);
  const openSheet = useSheet((state) => state.openSheet);

  const [variant, setVariant] = useState("request");
  const [loading, setLoading] = useState(false);

  const config = VARIANTS[variant];
  const { Icon } = config;

  const iconColor =
    variant === "success" ? theme.colors.teal : theme.colors.teal;

  const handlePrimary = async () => {
    if (variant === "success") {
      closeSheet();
      return;
    }

    if (!isPushNotificationSupported()) {
      closeSheet();
      return;
    }

    setLoading(true);
    try {
      const { granted } = await requestPushNotificationPermission({
        fallbackToSettings: true,
      });

      if (granted) {
        setVariant("success");
      } else {
        ToastError("Não foi possível ativar as notificações.");
        closeSheet();
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSecondary = () => {
    closeSheet();
  };

  return (
    <S.Container>
      <S.IconWrapper>
        {variant === "success" ? (
          <BellRingIcon size={28} color={iconColor} />
        ) : (
          <Icon size={28} color={iconColor} />
        )}
      </S.IconWrapper>

      <S.Content>
        <Text fontSize="xl" textAlign="center" fontWeight="bold">
          {config.title}
        </Text>
        <Text textAlign="center" color={theme.colors.stone}>
          {config.description}
        </Text>
      </S.Content>

      <S.Actions>
        {config.secondaryLabel && (
          <Button
            style={{ flexGrow: 1 }}
            size="sm"
            variant="outline"
            onPress={handleSecondary}
            disabled={loading}
          >
            {config.secondaryLabel}
          </Button>
        )}
        <Button
          style={{ flexGrow: 1 }}
          size="sm"
          onPress={handlePrimary}
          loading={loading}
        >
          {config.primaryLabel}
        </Button>
      </S.Actions>
    </S.Container>
  );
};
