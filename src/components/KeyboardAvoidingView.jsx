import {
  KeyboardAvoidingView as RNKeyboardAvoidingView,
  Platform,
} from "react-native";
import { useTheme } from "styled-components/native";

export const KeyboardAvoidingView = ({ children }) => {
  const theme = useTheme();

  return (
    <RNKeyboardAvoidingView
      style={{ flex: 1, backgroundColor: theme.colors.cream }}
      behavior={Platform.OS === "ios" ? "padding" : null}
      keyboardVerticalOffset={48}
    >
      {children}
    </RNKeyboardAvoidingView>
  );
};
