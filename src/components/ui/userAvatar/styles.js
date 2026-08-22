import styled from "styled-components/native";
import Animated from "react-native-reanimated";

import { Text } from "@/components/ui/text";

export const CIRCLE_SIZES = {
  sm: 32,
  md: 44,
  lg: 56,
};

const LETTER_FONT_SIZES = {
  sm: "base",
  md: "lg",
  lg: "xl",
};

const LABEL_FONT_SIZES = {
  sm: "xxs",
  md: "xs",
  lg: "sm",
};

export const Circle = styled.View`
  width: ${({ $size }) => CIRCLE_SIZES[$size || "md"]}px;
  height: ${({ $size }) => CIRCLE_SIZES[$size || "md"]}px;
  border-radius: 100px;
  background-color: ${({ $color }) => $color};
  align-items: center;
  justify-content: center;
  overflow: hidden;
`;

export const CircleLetter = styled(Text)`
  color: ${({ theme }) => theme.colors.white};
  font-family: Outfit-SemiBold;
  font-size: ${({ theme, $size }) =>
    theme.fontSize[LETTER_FONT_SIZES[$size || "md"]]};
`;

export const CircleLabel = styled(Text)`
  color: ${({ theme }) => theme.colors.white};
  font-family: Outfit-SemiBold;
  font-size: ${({ theme, $size }) =>
    theme.fontSize[LABEL_FONT_SIZES[$size || "md"]]};
  text-align: center;
`;

export const AvatarRingWrapper = styled.View`
  width: ${({ $size }) => CIRCLE_SIZES[$size || "lg"] + 10}px;
  height: ${({ $size }) => CIRCLE_SIZES[$size || "lg"] + 10}px;
  align-items: center;
  justify-content: center;
`;

export const AvatarRing = styled(Animated.View)`
  position: absolute;
  width: ${({ $size }) => CIRCLE_SIZES[$size || "lg"] + 8}px;
  height: ${({ $size }) => CIRCLE_SIZES[$size || "lg"] + 8}px;
  border-radius: 100px;
  border-width: 2.5px;
  border-color: ${({ theme }) => theme.colors.teal};
`;

export const ButtonWrapper = styled.TouchableOpacity.attrs({
  activeOpacity: 0.75,
})`
  align-items: center;
  gap: 2px;
  max-width: 80px;
`;

export const AddCircle = styled.View`
  width: ${CIRCLE_SIZES.lg}px;
  height: ${CIRCLE_SIZES.lg}px;
  border-radius: 100px;
  background-color: ${({ theme }) => theme.colors.white};
  border-width: 1.5px;
  border-color: ${({ theme }) => theme.colors.mint};
  align-items: center;
  justify-content: center;
`;
