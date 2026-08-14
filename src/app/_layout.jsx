import { useEffect, useState } from "react";
import { AppState } from "react-native";
import { focusManager } from "@tanstack/react-query";
import { Stack } from "expo-router";
import { useFonts } from "expo-font";
import { useRouter, useSegments } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { ThemeProvider } from "styled-components/native";
import { PostHogProvider } from "posthog-react-native";
import { configureReanimatedLogger } from "react-native-reanimated";

import { useAuthStore } from "@/store/auth";
import { Providers } from "@/components/Providers";
import { theme } from "@/theme";
import { initBugsnag, ErrorBoundary } from "@/sdk/bugsnag";
import { posthog } from "@/sdk/posthog";
import { initPushNotificationService } from "@/sdk/push-notification";
import { usePushNotificationHandlers } from "@/hooks/usePushNotificationHandlers";
import { useFlushPendingPushNavigation } from "@/hooks/useFlushPendingPushNavigation";
import { useAuthHydrated } from "@/hooks/useAuthHydrated";
import { AuthRoutes, resolveAuthRedirect } from "@/sdk/auth";
import { consumePendingPushNavigationHref } from "@/sdk/push-notification/schedule";

initBugsnag();

configureReanimatedLogger({
  strict: false,
});

SplashScreen.preventAutoHideAsync();

function AppLayout() {
  const [fontsLoaded] = useFonts({
    "Outfit-Light": require("../assets/fonts/outfit/Outfit-Light.ttf"),
    "Outfit-Regular": require("../assets/fonts/outfit/Outfit-Regular.ttf"),
    "Outfit-SemiBold": require("../assets/fonts/outfit/Outfit-SemiBold.ttf"),
    "Outfit-Bold": require("../assets/fonts/outfit/Outfit-Bold.ttf"),
  });

  const segments = useSegments();
  const router = useRouter();

  const [appIsReady, setAppIsReady] = useState(false);
  const hasHydrated = useAuthHydrated();

  const token = useAuthStore((state) => state.token);
  const isFirstAccess = useAuthStore((state) => state.isFirstAccess);
  const isAuthenticated = !!token?.access_token;

  usePushNotificationHandlers();
  useFlushPendingPushNavigation();

  function onAppStateChange(status) {
    focusManager.setFocused(status === "active");
  }

  useEffect(() => {
    const subscription = AppState.addEventListener("change", onAppStateChange);
    return () => subscription.remove();
  }, []);

  useEffect(() => {
    if (!fontsLoaded) return;
    initPushNotificationService();
  }, [fontsLoaded]);

  useEffect(() => {
    if (!fontsLoaded || !hasHydrated) return;

    // Autenticado: espera um tick para o click OneSignal (cold start)
    // agendar destino — ainda atrás da splash, sem passar pelo login.
    const delayMs = isAuthenticated ? 150 : 0;
    const timeoutId = setTimeout(() => {
      if (isAuthenticated) {
        const pendingHref = consumePendingPushNavigationHref();
        if (pendingHref) {
          router.replace(pendingHref);
        }
      }
      setAppIsReady(true);
      SplashScreen.hideAsync();
    }, delayMs);

    return () => clearTimeout(timeoutId);
  }, [fontsLoaded, hasHydrated, isAuthenticated]);

  useEffect(() => {
    if (!appIsReady) return;

    const href = resolveAuthRedirect({
      isAuthenticated,
      isFirstAccess,
      segments,
    });

    if (!href) return;

    if (href === AuthRoutes.home) {
      const pendingHref = consumePendingPushNavigationHref();
      router.replace(pendingHref ?? AuthRoutes.home);
      return;
    }

    router.replace(href);
  }, [appIsReady, isAuthenticated, isFirstAccess, segments]);

  if (!fontsLoaded || !hasHydrated) {
    return null;
  }

  return (
    <ThemeProvider theme={theme}>
      <Providers>
        <Stack
          screenOptions={{
            headerShown: false,
            contentStyle: {
              backgroundColor: theme.colors.cream,
            },
          }}
        >
          <Stack.Screen name="index" />
          <Stack.Screen name="camera" />
          <Stack.Screen
            name="first-access/index"
            options={{ gestureEnabled: false }}
          />
          <Stack.Screen name="(public)" />
          <Stack.Screen name="(private)" />
        </Stack>
      </Providers>
    </ThemeProvider>
  );
}

export default function RootLayout() {
  return (
    <ErrorBoundary>
      <PostHogProvider client={posthog}>
        <AppLayout />
      </PostHogProvider>
    </ErrorBoundary>
  );
}
