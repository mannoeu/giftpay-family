import styled from "styled-components/native";

export const Container = styled.View`
  flex-direction: column;
  gap: 16px;
`;

export const Header = styled.View`
  flex-direction: column;
  gap: 4px;
`;

export const AvatarSection = styled.View`
  flex-direction: column;
  gap: 8px;
`;

export const AvatarRow = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
`;

export const Fields = styled.View`
  flex-direction: column;
  gap: 12px;
`;

export const SuccessContent = styled.View`
  flex-direction: column;
  gap: 8px;
  align-items: center;
`;

export const Image = styled.Image.attrs({
  resizeMode: "contain",
})`
  width: 200px;
  height: 190px;
  margin-horizontal: auto;
`;

export const Actions = styled.View`
  flex: 1;
  flex-direction: row;
  flex-wrap: wrap;

  margin-top: 16px;
  gap: 16px;
`;
