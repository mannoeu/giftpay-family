import { Text } from "react-native";

import { Button } from "@/components/ui/button";
import { useTabBarBottomPadding } from "@/hooks/useTabBarBottomPadding";
import { handleLogout } from "@/sdk/session";
import * as S from "./_components/styles";

export default function HomeScreen() {
  const paddingBottom = useTabBarBottomPadding();

  return (
    <S.Container
      $paddingBottom={paddingBottom}
      showsVerticalScrollIndicator={false}
    >
      <Text>Home</Text>
      <Button variant="outline" onPress={handleLogout}>
        Sair
      </Button>
    </S.Container>
  );
}
