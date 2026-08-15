import { useRouter } from "expo-router";
import { useTheme } from "styled-components/native";

import { ChevronLeft } from "lucide-react-native";

import { Text } from "@/components/ui/text";

import * as S from "./styles";

export const Header = ({ title = "", rightContent, defaultBackRoute }) => {
  const router = useRouter();
  const theme = useTheme();

  const canGoBack = router.canGoBack();
  const renderBack = canGoBack || !!defaultBackRoute;

  const onPress = () => {
    if (canGoBack) {
      router.back();
    } else if (defaultBackRoute) {
      router.replace(defaultBackRoute);
    }
  };

  return (
    <S.Container>
      <S.Button activeOpacity={0.8} disabled={!renderBack} onPress={onPress}>
        {renderBack && (
          <ChevronLeft size={20} color={theme.colors.charcoal} />
        )}
        <Text fontSize="base" fontWeight="bold">
          {title}
        </Text>
      </S.Button>
      {rightContent}
    </S.Container>
  );
};
