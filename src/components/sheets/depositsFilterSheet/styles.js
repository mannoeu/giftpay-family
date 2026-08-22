import styled from "styled-components/native";

export const Container = styled.View`
  flex-direction: column;
  gap: 16px;
`;

export const Header = styled.View`
  flex-direction: column;
  gap: 4px;
`;

export const Options = styled.View`
  flex-direction: column;
  gap: 8px;
`;

export const Option = styled.TouchableOpacity.attrs({
  activeOpacity: 0.75,
})`
  padding: 14px 16px;
  border-radius: 12px;
  background-color: ${({ theme, $selected }) =>
    $selected ? theme.colors.mint : theme.colors.white};
  border: 1px solid
    ${({ theme, $selected }) =>
      $selected ? theme.colors.teal : theme.colors.mint};
`;
