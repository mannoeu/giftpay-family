import styled from "styled-components/native";
import { DEFAULT_PADDING } from "@/components/layout-constants";

export const Container = styled.View`
  flex: 1;
`;

export const Overlay = styled.View`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: ${({ theme }) =>
    theme?.colors?.opacity?.(theme?.colors?.cream, 80)};
`;

export const Content = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
  gap: 12px;
  padding: ${DEFAULT_PADDING}px;
`;
