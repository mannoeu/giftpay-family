import { Alert } from "react-native";

import { LogOutIcon } from "lucide-react-native";

import { SmallBrand } from "@/components/brand";
import { Button } from "@/components/ui/button";

import { handleLogout } from "@/sdk/session";

import * as S from "./styles";

export const TopHeader = () => {
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

  return (
    <S.Container>
      <SmallBrand />
      <Button
        variant="outline"
        onPress={handlePressLogout}
        icon={<LogOutIcon />}
      >
        Sair
      </Button>
    </S.Container>
  );
};
