import { useTheme } from "styled-components/native";
import {
  SafeAreaView,
  initialWindowMetrics,
} from "react-native-safe-area-context";

import { KeyboardAvoidingView } from "@/components/KeyboardAvoidingView";
import * as S from "./styles";

export const Layout = ({ children }) => {
  const theme = useTheme();

  return (
    <SafeAreaView
      initialMetrics={initialWindowMetrics}
      style={{ flex: 1, backgroundColor: theme.colors.background }}
    >
      <KeyboardAvoidingView>
        <S.Container>{children}</S.Container>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};
