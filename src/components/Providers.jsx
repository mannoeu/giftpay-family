import { useEffect } from "react";
import { StatusBar } from "expo-status-bar";
import * as NavigationBar from "expo-navigation-bar";
import { useTheme } from "styled-components/native";
import { onlineManager, QueryClientProvider } from "@tanstack/react-query";
import { Platform } from "react-native";

import * as Network from "expo-network";

import { SheetRoot } from "@/components/sheets";
import { ToastsRoot } from "@/sdk/toast";
import { queryClient } from "@/services/queryClient";

import { GestureHandlerRootView } from "react-native-gesture-handler";
import { KeyboardProvider } from "react-native-keyboard-controller";

export { queryClient } from "@/services/queryClient";

export const Providers = ({ children }) => {
  const theme = useTheme();

  useEffect(() => {
    const networkSubscriber = Network.addNetworkStateListener(
      ({ isConnected }) => {
        onlineManager.setOnline(isConnected);
      },
    );

    return () => {
      networkSubscriber.remove();
    };
  }, []);

  useEffect(() => {
    if (Platform.OS !== "android") return;
    NavigationBar.setStyle("light");
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <GestureHandlerRootView
        style={{
          flex: 1,
          backgroundColor: theme.colors.cream,
        }}
      >
        <StatusBar style="dark" />
        <ToastsRoot />
        <KeyboardProvider>
          {children}
          <SheetRoot />
        </KeyboardProvider>
      </GestureHandlerRootView>
    </QueryClientProvider>
  );
};
