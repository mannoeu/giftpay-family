import { Tabs } from "expo-router";

import {
  SafeAreaView,
  initialWindowMetrics,
} from "react-native-safe-area-context";
import { useTheme } from "styled-components/native";

import { TabBar } from "@/components/tabBar";

import { HomeIcon } from "@/components/tabBar/tabBarIcons";

export default function PrivateLayout() {
  const theme = useTheme();

  return (
    <SafeAreaView
      edges={["top", "left", "right"]}
      initialMetrics={initialWindowMetrics}
      style={{
        flex: 1,
        backgroundColor: theme.colors.background,
      }}
    >
      <Tabs
        lazy
        tabBar={(props) => <TabBar {...props} />}
        screenOptions={{
          headerShown: false,
          animation: "none",
          sceneStyle: {
            backgroundColor: theme.colors.background,
          },
        }}
      >
        <Tabs.Screen
          name="home"
          options={{
            tabBarLabel: "Início",
            tabBarIcon: HomeIcon,
          }}
        />
      </Tabs>
    </SafeAreaView>
  );
}
