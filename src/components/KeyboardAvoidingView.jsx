import { KeyboardAwareScrollView } from "react-native-keyboard-controller";
import { useTheme } from "styled-components/native";

import { DEFAULT_PADDING } from "@/components/layout-constants";

export const KeyboardAvoidingView = ({ children }) => {
  const theme = useTheme();

  return (
    <KeyboardAwareScrollView
      style={{ flex: 1, backgroundColor: theme.colors.cream }}
      contentContainerStyle={{ flexGrow: 1 }}
      keyboardShouldPersistTaps="handled"
      alwaysBounceVertical={false}
      bottomOffset={DEFAULT_PADDING}
      extraKeyboardSpace={DEFAULT_PADDING}
    >
      {children}
    </KeyboardAwareScrollView>
  );
};
