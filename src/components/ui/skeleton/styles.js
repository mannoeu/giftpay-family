import styled from "styled-components/native";
import Animated from "react-native-reanimated";

export const Container = styled(Animated.View)`
  background-color: ${({ theme }) => theme.colors.grey};
  border-radius: ${({ rounded }) =>
    rounded === "full" ? "9999px" : rounded || "8px"};
  overflow: hidden;
  width: ${({ width }) =>
    typeof width === "number" ? `${width}px` : width || "100%"};
  height: ${({ height }) =>
    typeof height === "number" ? `${height}px` : height || "20px"};
`;
