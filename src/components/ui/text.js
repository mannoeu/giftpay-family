import styled from "styled-components/native";

const getFontWeight = (weight) => {
  switch (weight) {
    case "bold":
      return "Outfit-Bold";
    case "semibold":
      return "Outfit-SemiBold";
    case "light":
      return "Outfit-Light";
    default:
      return "Outfit-Regular";
  }
};

export const Text = styled.Text`
  text-decoration: ${({ decoration }) => {
    const decorations = {
      underline: "underline",
      line: "line-through",
      none: "none",
    };

    return decorations[decoration] || "none";
  }};
  text-decoration-color: ${({ theme, color }) =>
    color || theme.colors.foreground};
  color: ${({ theme, color }) => color || theme.colors.foreground};
  flex-wrap: wrap;
  text-transform: ${({ textTransform }) => textTransform || "none"};
  text-align: ${({ textAlign }) => textAlign || "start"};
  font-size: ${({ fontSize, theme }) =>
    theme.fontSize[fontSize] || theme.fontSize.base};
  font-family: ${({ fontWeight }) => getFontWeight(fontWeight)};
  flex-shrink: 1;
`;
