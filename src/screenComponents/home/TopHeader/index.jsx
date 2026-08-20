import { Alert } from "react-native";

import { BellIcon, LogOutIcon } from "lucide-react-native";
import { useTheme } from "styled-components/native";

import { SmallBrand } from "@/components/brand";
import { NotificationsSheet } from "@/components/sheets/notificationsSheet";
import { Button } from "@/components/ui/button";
import { handleLogout } from "@/sdk/session";
import { isPushNotificationSupported } from "@/sdk/push-notification";
import { useSheet } from "@/store/sheet";

import * as S from "./styles";

export const TopHeader = () => {
  const theme = useTheme();
  const openSheet = useSheet((state) => state.openSheet);

  const handlePressLogout = () => {
    Alert.alert(
      "Desconectar da conta",
      "Tem certeza que deseja sair da sua conta?",
      [
        { text: "Cancelar", style: "cancel" },
        { text: "Sair", onPress: handleLogout },
      ],
    );
  };

  const handlePressBell = () => {
    openSheet(<NotificationsSheet />);
  };

  return (
    <S.Container>
      <SmallBrand />
      <S.Actions>
        {isPushNotificationSupported() && (
          <Button
            variant="outline"
            size="icon"
            onPress={handlePressBell}
            icon={<BellIcon color={theme.colors.charcoal} />}
          />
        )}
        <Button
          variant="outline"
          onPress={handlePressLogout}
          icon={<LogOutIcon />}
        >
          Sair
        </Button>
      </S.Actions>
    </S.Container>
  );
};
