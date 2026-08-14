import { useMemo } from "react";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { useTabBar } from "@/store/tabBar";

import { DEFAULT_PADDING } from "@/components/layout-constants";

export const useTabBarBottomPadding = () => {
  const insets = useSafeAreaInsets();
  const tabBarHeight = useTabBar((state) => state.tabBarHeight);

  const bottomPadding = useMemo(
    () => (tabBarHeight > 0 ? tabBarHeight : insets.bottom) + DEFAULT_PADDING,
    [tabBarHeight, insets.bottom]
  );

  return bottomPadding;
};
