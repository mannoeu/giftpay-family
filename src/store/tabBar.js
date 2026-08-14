import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";

import { Storage } from "@/sdk/storage";

export const useTabBar = create(
  persist(
    immer((set) => ({
      tabBarHeight: 60,
      setTabBarHeight: (height) => {
        set((state) => {
          state.tabBarHeight = height;
        });
      },
    })),
    {
      name: "@giftpay-family/tab-bar-height",
      storage: createJSONStorage(() => Storage),
    }
  )
);
