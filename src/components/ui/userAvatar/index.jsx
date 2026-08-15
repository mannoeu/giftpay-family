import { useEffect } from "react";

import { PlusIcon } from "lucide-react-native";
import { useTheme } from "styled-components/native";
import {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";

import { Skeleton } from "@/components/ui/skeleton";
import { Text } from "@/components/ui/text";
import * as S from "./styles";

export const UserAvatar = ({ color, letter, label, size = "lg" }) => (
  <S.Circle $color={color} $size={size}>
    {letter ? <S.CircleLetter $size={size}>{letter}</S.CircleLetter> : null}
    {label ? <S.CircleLabel $size={size}>{label}</S.CircleLabel> : null}
  </S.Circle>
);

export const UserAvatarButton = ({
  color,
  name,
  label,
  onPress,
  size = "lg",
  selected = false,
  ...rest
}) => {
  const theme = useTheme();
  const progress = useSharedValue(selected ? 1 : 0);

  useEffect(() => {
    progress.value = withTiming(selected ? 1 : 0, { duration: 200 });
  }, [selected, progress]);

  const ringStyle = useAnimatedStyle(() => ({
    opacity: progress.value,
  }));

  return (
    <S.ButtonWrapper onPress={onPress} {...rest}>
      <S.AvatarRingWrapper $size={size}>
        <S.AvatarRing $size={size} style={ringStyle} />
        <UserAvatar
          color={color ?? theme.colors.tealDeep}
          letter={label ? undefined : name?.charAt(0).toUpperCase()}
          label={label}
          size={size}
        />
      </S.AvatarRingWrapper>
      <Text fontSize="xs">{name}</Text>
    </S.ButtonWrapper>
  );
};

export const UserAvatarButtonSkeleton = ({ name, size = "lg" }) => (
  <S.ButtonWrapper disabled>
    <S.AvatarRingWrapper $size={size}>
      <Skeleton
        width={S.CIRCLE_SIZES[size]}
        height={S.CIRCLE_SIZES[size]}
        rounded="full"
      />
    </S.AvatarRingWrapper>
    {name ? <Skeleton width={36} height={10} rounded="4px" /> : null}
  </S.ButtonWrapper>
);

export const UserAvatarAdd = ({ onPress, ...rest }) => {
  const theme = useTheme();

  return (
    <S.ButtonWrapper onPress={onPress} {...rest}>
      <S.AvatarRingWrapper $size="lg">
        <S.AddCircle>
          <PlusIcon size={22} color={theme.colors.stone} />
        </S.AddCircle>
      </S.AvatarRingWrapper>
      <Text fontSize="xs">Adicionar</Text>
    </S.ButtonWrapper>
  );
};
