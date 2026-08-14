import { useEffect } from "react";

import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSpring,
  Easing,
  interpolate,
} from "react-native-reanimated";

import { House } from "lucide-react-native";

const AnimatedIcon = ({ icon: Icon, focused, color, size = 24 }) => {
  const translateY = useSharedValue(focused ? -2 : 0);
  const scale = useSharedValue(0);

  useEffect(() => {
    translateY.value = withTiming(focused ? -2 : 0, {
      duration: 150,
      easing: Easing.out(Easing.quad),
    });
  }, [focused]);

  useEffect(() => {
    scale.value = withSpring(focused ? 1 : 0, {
      duration: 350,
    });
  }, [focused, scale]);

  const animatedStyle = useAnimatedStyle(() => {
    const scaleValue = interpolate(scale.value, [0, 1], [0.98, 1.02]);

    return {
      transform: [{ translateY: translateY.value }, { scale: scaleValue }],
    };
  });

  return (
    <Animated.View style={animatedStyle}>
      <Icon size={size} color={color} />
    </Animated.View>
  );
};

export const HomeIcon = (props) => <AnimatedIcon {...props} icon={House} />;
