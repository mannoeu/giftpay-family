import { Stack } from "expo-router";
import { useTheme } from "styled-components/native";
import {
  SafeAreaView,
  initialWindowMetrics,
} from "react-native-safe-area-context";

export default function PublicLayout() {
  const theme = useTheme();

  return (
    <SafeAreaView
      initialMetrics={initialWindowMetrics}
      style={{
        flex: 1,
        backgroundColor: theme.colors.cream,
      }}
    >
      <Stack
        screenOptions={{
          headerShown: false,
        }}
      >
        <Stack.Screen name="login/index" />
        <Stack.Screen name="sign-up" />
      </Stack>
    </SafeAreaView>
  );
}
