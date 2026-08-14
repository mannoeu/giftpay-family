import React from "react";
import Reanimated, {
  Easing,
  useAnimatedStyle,
  withSpring,
  withTiming,
  useSharedValue,
} from "react-native-reanimated";

import * as S from "./styles";

const AnimatedPressable = Reanimated.createAnimatedComponent(S.Pressable);

export const CaptureButton = React.memo(
  ({ camera, onPress, setIsPressingButton, cameraPosition, ...props }) => {
    const isPressingButton = useSharedValue(false);

    const onCaptureButtonPress = React.useCallback(async () => {
      try {
        isPressingButton.value = true;
        setIsPressingButton(true);
        await onPress();
      } finally {
        isPressingButton.value = false;
        setIsPressingButton(false);
      }
    }, [isPressingButton, setIsPressingButton, onPress]);

    const shadowStyle = useAnimatedStyle(
      () => ({
        transform: [
          {
            scale: withSpring(isPressingButton.value ? 1 : 0, {
              mass: 1,
              damping: 35,
              stiffness: 300,
            }),
          },
        ],
      }),
      [isPressingButton]
    );

    const buttonStyle = useAnimatedStyle(() => {
      return {
        opacity: withTiming(1, {
          duration: 100,
          easing: Easing.linear,
        }),
      };
    }, []);

    return (
      <AnimatedPressable
        {...props}
        style={[buttonStyle]}
        onPress={onCaptureButtonPress}
        activeOpacity={1}
      >
        <S.Shutter style={[shadowStyle]} />
        <S.Button />
      </AnimatedPressable>
    );
  }
);
