import { Stack } from "expo-router";
import { useTheme } from "styled-components/native";

export default function HomeLayout() {
  const theme = useTheme();

  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: {
          backgroundColor: theme.colors.cream,
        },
      }}
    >
      <Stack.Screen name="index" />
    </Stack>
  );
}
