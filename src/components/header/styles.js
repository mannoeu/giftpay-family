import styled from "styled-components/native";

import { DEFAULT_PADDING } from "@/components/layout-constants";

export const Container = styled.View`
  padding-horizontal: ${DEFAULT_PADDING}px;
  background-color: ${({ theme }) => theme.colors.cream};
  border-color: ${({ theme }) => theme.colors.mint};
  border-bottom-width: 1px;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  gap: 16px;
`;

export const Button = styled.TouchableOpacity`
  flex-direction: row;
  align-items: center;
  gap: 4px;
  padding-vertical: ${DEFAULT_PADDING / 2}px;
`;
