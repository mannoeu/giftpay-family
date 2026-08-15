import { useEffect } from "react";

import {
  useAnimatedStyle,
  withTiming,
  interpolate,
  useSharedValue,
} from "react-native-reanimated";

import { Text } from "@/components/ui/text";

import * as S from "./styles";

const RadioOption = ({ option, selected, onSelect }) => {
  const progress = useSharedValue(selected ? 1 : 0);

  useEffect(() => {
    progress.value = withTiming(selected ? 1 : 0, { duration: 200 });
  }, [selected, progress]);

  const dotStyle = useAnimatedStyle(() => ({
    transform: [{ scale: interpolate(progress.value, [0, 1], [0, 1]) }],
    opacity: progress.value,
  }));

  return (
    <S.Option onPress={() => onSelect(option.value)}>
      <S.Dot selected={selected}>
        <S.DotInner style={dotStyle} />
      </S.Dot>
      <Text fontWeight={selected ? "semibold" : "regular"}>{option.label}</Text>
    </S.Option>
  );
};

export const Radio = ({ options = [], value, onChange }) => {
  return (
    <S.Container>
      {options.map((option) => (
        <RadioOption
          key={option.value}
          option={option}
          selected={value === option.value}
          onSelect={onChange}
        />
      ))}
    </S.Container>
  );
};
