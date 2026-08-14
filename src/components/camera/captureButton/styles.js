import styled from "styled-components/native";
import Reanimated from "react-native-reanimated";

import {
  CAPTURE_BUTTON_SIZE,
  BORDER_WIDTH,
} from "@/components/camera/constants";

export const Pressable = styled.Pressable`
  align-self: center;
  bottom: 16px;
`;

export const Shutter = styled(Reanimated.View)`
  position: absolute;
  width: ${CAPTURE_BUTTON_SIZE}px;
  height: ${CAPTURE_BUTTON_SIZE}px;
  border-radius: ${CAPTURE_BUTTON_SIZE / 2}px;
  background-color: white;
`;

export const Button = styled(Reanimated.View)`
  width: ${CAPTURE_BUTTON_SIZE}px;
  height: ${CAPTURE_BUTTON_SIZE}px;
  border-radius: ${CAPTURE_BUTTON_SIZE / 2}px;
  border-width: ${BORDER_WIDTH}px;
  border-color: lightgray;
`;
