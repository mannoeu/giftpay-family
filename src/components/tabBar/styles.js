import styled from "styled-components/native";
import Animated from "react-native-reanimated";

import { getBadgeMargin } from "./utils";

export const Container = styled(Animated.View)`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  z-index: 15;

  background-color: ${({ theme }) => theme.colors.cream};
  border-color: ${({ theme }) => theme.colors.mint};
  border-top-width: 1px;
  min-height: ${({ baseHeight }) => baseHeight}px;

  overflow: hidden;
`;

export const Pressable = styled.Pressable`
  flex: 1;
  justify-content: center;
  align-items: center;
  gap: 4px;
  padding: 10px;
  z-index: 20;
`;

export const IconContainer = styled.View`
  position: relative;
`;

export const Badge = styled.View`
  position: absolute;
  top: -4px;
  right: ${({ value }) => getBadgeMargin(value)}px;
  min-width: 14px;
  min-height: 14px;
  padding-horizontal: 4px;
  justify-content: center;
  align-items: center;
  border-radius: 999px;
  background-color: ${({ theme }) => theme.colors.danger};
  z-index: 25;
`;
