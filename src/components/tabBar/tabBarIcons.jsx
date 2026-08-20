import { useLayoutEffect } from "react";

import Svg, { Path } from "react-native-svg";
import Animated, {
  Easing,
  useAnimatedProps,
  useSharedValue,
  withSequence,
  withTiming,
} from "react-native-reanimated";

const AnimatedPath = Animated.createAnimatedComponent(Path);

const DRAW_DURATION = 620;
const DRAW_EASING = Easing.bezier(0.4, 0, 0.2, 1);

const HOUSE_PATHS = [
  "M15 21v-8a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1v8",
  "M3 10a2 2 0 0 1 .709-1.528l7-5.999a2 2 0 0 1 2.582 0l7 5.999A2 2 0 0 1 21 10v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z",
];

const BELL_PATHS = [
  "M10.268 21a2 2 0 0 0 3.464 0",
  "M3.262 15.326A1 1 0 0 0 4 17h16a1 1 0 0 0 .74-1.673C19.41 13.956 18 12.499 18 8A6 6 0 0 0 6 8c0 4.499-1.411 5.956-2.738 7.326",
];

const HOUSE_PATH_LENGTH = 68;
const BELL_PATH_LENGTH = 64;

const DrawnPath = ({ d, color, pathLength, progress }) => {
  const animatedProps = useAnimatedProps(() => ({
    strokeDashoffset: pathLength * (1 - progress.value),
  }));

  return (
    <AnimatedPath
      d={d}
      stroke={color}
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      fill="none"
      strokeDasharray={[pathLength, pathLength]}
      animatedProps={animatedProps}
    />
  );
};

const AnimatedStrokeIcon = ({
  paths,
  pathLength,
  focused,
  color,
  size = 24,
}) => {
  const progress = useSharedValue(focused ? 0 : 1);

  useLayoutEffect(() => {
    if (focused) {
      progress.value = withSequence(
        withTiming(0, { duration: 0 }),
        withTiming(1, { duration: DRAW_DURATION, easing: DRAW_EASING }),
      );
      return;
    }

    progress.value = 1;
  }, [focused, progress]);

  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      {paths.map((d) => (
        <DrawnPath
          key={d}
          d={d}
          color={color}
          pathLength={pathLength}
          progress={progress}
        />
      ))}
    </Svg>
  );
};

export const HomeIcon = (props) => (
  <AnimatedStrokeIcon
    {...props}
    paths={HOUSE_PATHS}
    pathLength={HOUSE_PATH_LENGTH}
  />
);

export const ActivitiesIcon = (props) => (
  <AnimatedStrokeIcon
    {...props}
    paths={BELL_PATHS}
    pathLength={BELL_PATH_LENGTH}
  />
);
