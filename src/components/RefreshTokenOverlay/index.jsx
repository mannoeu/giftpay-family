import { Modal, ActivityIndicator, Platform, StyleSheet } from "react-native";
import { useTheme } from "styled-components/native";
import { BlurView } from "expo-blur";

import { Text } from "@/components/ui/text";

import * as S from "./styles";

export function RefreshTokenOverlay() {
  const theme = useTheme();

  return (
    <Modal visible transparent animationType="fade">
      <S.Container pointerEvents="auto">
        <BlurView
          intensity={8}
          experimentalBlurMethod={
            Platform.OS === "android" ? "dimezisBlurView" : undefined
          }
          tint="light"
          style={StyleSheet.absoluteFill}
        />
        <S.Overlay />
        <S.Content>
          <ActivityIndicator size="large" color={theme?.colors?.teal} />
          <Text fontSize="sm" fontWeight="semibold" textAlign="center">
            Aguarde enquanto restauramos sua sessão..
          </Text>
        </S.Content>
      </S.Container>
    </Modal>
  );
}
