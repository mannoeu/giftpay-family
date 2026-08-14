import { useEffect, useState } from "react";
import { usePathname } from "expo-router";
import { useTheme } from "styled-components/native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Platform } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
} from "react-native-reanimated";

import { useTabBar } from "@/store/tabBar";

import { TabBarButton } from "./tabBarButton";
import { shouldHideTabsForPath } from "./utils";
import * as S from "./styles";

export const TabBar = ({ state, descriptors, navigation }) => {
  const theme = useTheme();
  const pathname = usePathname();
  const insets = useSafeAreaInsets();
  const setTabBarHeight = useTabBar((state) => state.setTabBarHeight);
  const translateY = useSharedValue(0);

  const [isVisible, setIsVisible] = useState(true);

  const BASE_HEIGHT = 68;
  const TOTAL_HEIGHT = BASE_HEIGHT + insets.bottom;

  useEffect(() => {
    const shouldHideTabs = shouldHideTabsForPath(pathname);

    if (shouldHideTabs) {
      setIsVisible(false);
      translateY.value = withTiming(100, { duration: 350 });
    } else {
      translateY.value = withTiming(0, { duration: 350 });

      setTimeout(
        () => {
          setIsVisible(true);
        },
        Platform.OS === "android" ? 500 : 450
      );
    }

    setTabBarHeight(shouldHideTabs ? 0 : TOTAL_HEIGHT);
  }, [pathname]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
    opacity: translateY.value > 50 ? 0 : 1,
  }));

  return (
    <Animated.View
      pointerEvents={isVisible ? "auto" : "none"}
      style={[
        {
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          zIndex: 10,
          backgroundColor: theme.colors.cream,
          height: TOTAL_HEIGHT,
        },
        animatedStyle,
      ]}
    >
      <S.Container baseHeight={BASE_HEIGHT}>
        {state.routes.map((route, index) => {
          const { options } = descriptors[route.key];
          const label =
            options.tabBarLabel !== undefined
              ? options.tabBarLabel
              : options.title !== undefined
              ? options.title
              : route.name;

          if (["_sitemap", "+not-found"].includes(route.name)) return null;

          const isFocused = state.index === index;

          const onPress = () => {
            const event = navigation.emit({
              type: "tabPress",
              target: route.key,
              canPreventDefault: true,
            });

            if (!isFocused && !event.defaultPrevented) {
              navigation.navigate(route.name, route.params);
            }
          };

          const onLongPress = () => {
            navigation.emit({
              type: "tabLongPress",
              target: route.key,
            });
          };

          return (
            <TabBarButton
              key={route.name}
              onPress={onPress}
              onLongPress={onLongPress}
              isFocused={isFocused}
              routeName={route.name}
              color={
                isFocused
                  ? theme.colors.teal
                  : theme.colors.stone
              }
              label={label}
              badge={options?.badge}
              renderIcon={options?.tabBarIcon}
            />
          );
        })}
      </S.Container>
    </Animated.View>
  );
};
