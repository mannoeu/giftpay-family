import styled from "styled-components/native";

export const Container = styled.TouchableOpacity.attrs({
  activeOpacity: 0.9,
})`
  position: relative;
  cursor: text;

  flex-direction: row;
  justify-content: center;
  align-items: center;
  align-self: center;
  gap: 6px;

  overflow: hidden;
`;

export const Cell = styled.View`
  width: 40px;
  height: 50px;
  border-width: 1px;
  border-color: ${({ $focused, theme }) =>
    $focused ? theme.colors.primarySystem : theme.colors.border};
  border-style: ${({ $disabled }) => ($disabled ? "dashed" : "solid")};
  background-color: ${({ theme }) => theme.colors.background};
  border-radius: 8px;
  justify-content: center;
  align-items: center;
  z-index: 1;
`;
