import styled from "styled-components/native";
import {
  CONTENT_SPACING,
  CONTROL_BUTTON_SIZE,
} from "@/components/camera/constants";

export const Button = styled.Pressable`
  margin-bottom: ${CONTENT_SPACING}px;
  width: ${CONTROL_BUTTON_SIZE}px;
  height: ${CONTROL_BUTTON_SIZE}px;
  border-radius: ${CONTROL_BUTTON_SIZE / 2}px;
  background-color: rgba(140, 140, 140, 0.3);
  justify-content: center;
  align-items: center;
`;
