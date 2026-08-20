import styled from "styled-components/native";
import { DEFAULT_PADDING } from "@/components/layout-constants";

export const Container = styled.View`
  flex-grow: 1;
  width: 100%;
  background-color: ${({ theme }) => theme.colors.cream};
  padding: 24px ${DEFAULT_PADDING}px;
  gap: 24px;
`;
