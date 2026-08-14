import styled from "styled-components/native";
import { DEFAULT_PADDING } from "@/components/layout-constants";

export const Container = styled.View`
  flex: 1;
  background-color: ${({ theme }) => theme.colors.cream};
  padding: ${DEFAULT_PADDING}px;
`;

export const Permissions = styled.View`
  justify-content: center;
  align-items: center;
  gap: 8px;
  margin: auto;
`;

export const Actions = styled.View`
  margin-top: 16px;
  justify-content: center;
  align-items: center;
`;

export const CameraContainer = styled.View`
  flex: 1;
  justify-content: center;
`;

export const CameraButtons = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  padding: ${DEFAULT_PADDING}px;

  width: 100%;
  position: absolute;
  gap: 16px;
  bottom: 0px;
`;
