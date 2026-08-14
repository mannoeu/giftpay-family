import React from "react";

import { Text } from "@/components/ui/text";

import { MAX_BADGE_VALUE } from "./utils";
import * as S from "./styles";

export const TabBarButton = ({
  label,
  badge,
  isFocused,
  color,
  routeName,
  onPress,
  onLongPress,
  renderIcon,
}) => {
  const displayBadgeValue =
    badge > MAX_BADGE_VALUE ? `+${MAX_BADGE_VALUE}` : badge;

  return (
    <S.Pressable onPress={onPress} onLongPress={onLongPress}>
      <S.IconContainer>
        {!!badge && (
          <S.Badge value={badge}>
            <Text fontSize="xxs">{displayBadgeValue}</Text>
          </S.Badge>
        )}
        {renderIcon?.({ color, size: 24, focused: isFocused })}
      </S.IconContainer>

      <Text allowFontScaling={false} fontSize="xs" color={color}>
        {label}
      </Text>
    </S.Pressable>
  );
};
