import styled from "styled-components/native";
import Animated from "react-native-reanimated";

export const Container = styled.View`
  flex-direction: column;
  gap: 0px;
`;

export const Option = styled.TouchableOpacity.attrs({ activeOpacity: 0.8 })`
  flex-direction: row;
  align-items: center;
  gap: 12px;
  padding: 12px 0px;
  align-self: flex-start;
`;

export const Dot = styled(Animated.View)`
  width: 20px;
  height: 20px;
  border-radius: 10px;
  border-width: 2px;
  border-color: ${({ theme, selected }) =>
    selected ? theme.colors.teal : theme.colors.stone};
  align-items: center;
  justify-content: center;
`;

export const DotInner = styled(Animated.View)`
  width: 10px;
  height: 10px;
  border-radius: 5px;
  background-color: ${({ theme }) => theme.colors.teal};
`;
