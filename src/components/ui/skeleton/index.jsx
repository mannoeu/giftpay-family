import { useEffect } from "react";
import {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  Easing,
} from "react-native-reanimated";

import * as S from "./styles";

export const Skeleton = ({ width, height, rounded, style }) => {
  const opacity = useSharedValue(1);

  useEffect(() => {
    opacity.value = withRepeat(
      withTiming(0.4, { duration: 800, easing: Easing.inOut(Easing.ease) }),
      -1,
      true,
    );
  }, [opacity]);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

  return (
    <S.Container
      width={width}
      height={height}
      rounded={rounded}
      style={[animatedStyle, style]}
    />
  );
};
