import React, { useEffect, useRef } from "react";
import { View } from "react-native";
import { useTheme } from "styled-components/native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { useSheet } from "@/store/sheet";

import {
  BottomSheetModal,
  BottomSheetModalProvider,
  BottomSheetScrollView,
} from "@gorhom/bottom-sheet";

import { DEFAULT_PADDING } from "@/components/layout-constants";

export const SheetRoot = () => {
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const { content, isVisible, closeSheet, snapPoints, enablePanDownToClose } =
    useSheet();
  const modalRef = useRef(null);

  const canPanDownToClose = enablePanDownToClose ?? true;

  useEffect(() => {
    const timeout = setTimeout(() => {
      if (isVisible) {
        modalRef.current?.present();
      } else {
        modalRef.current?.dismiss();
      }
    }, 0);

    return () => clearTimeout(timeout);
  }, [isVisible]);

  return (
    <BottomSheetModalProvider>
      <BottomSheetModal
        ref={modalRef}
        onDismiss={closeSheet}
        snapPoints={snapPoints}
        keyboardBehavior="interactive"
        keyboardBlurBehavior="restore"
        enablePanDownToClose={canPanDownToClose}
        android_keyboardInputMode="adjustPan"
        backdropComponent={({ style }) => (
          <View style={[style, { backgroundColor: "rgba(0, 0, 0, 0.85)" }]} />
        )}
        backgroundComponent={({ style }) => (
          <View style={[style, { backgroundColor: theme.colors.background }]} />
        )}
        handleIndicatorStyle={{
          backgroundColor: theme.colors.input,
          marginTop: 8,
        }}
        handleStyle={{
          backgroundColor: theme.colors.background,
        }}
        style={{
          backgroundColor: theme.colors.background,
        }}
      >
        <BottomSheetScrollView
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{
            paddingHorizontal: DEFAULT_PADDING,
            paddingTop: DEFAULT_PADDING / 2,
            paddingBottom: insets.bottom + DEFAULT_PADDING,
            backgroundColor: theme.colors.background,
          }}
        >
          <View
            style={{
              maxWidth: 600,
              width: "100%",
              margin: "auto",
            }}
          >
            {content || null}
          </View>
        </BottomSheetScrollView>
      </BottomSheetModal>
    </BottomSheetModalProvider>
  );
};
