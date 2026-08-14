import React from "react";
import { useTheme } from "styled-components/native";

import * as S from "./styles";

export const Button = ({
  disabled,
  variant,
  size,
  loading,
  onPress,
  children,
  icon,
  ...rest
}) => {
  const theme = useTheme();

  return (
    <S.Container
      {...rest}
      disabled={disabled}
      variant={variant}
      size={size}
      onPress={(event) => {
        if (!loading && !disabled) {
          onPress?.(event);
        }
      }}
    >
      {!loading &&
        icon &&
        React.cloneElement(icon, {
          size: 18,
          color: S.getButtonTextColor(variant, theme),
        })}
      <S.ButtonText variant={variant} loading={loading}>
        {children}
      </S.ButtonText>
      {loading && <S.Loader variant={variant} loading={loading} />}
    </S.Container>
  );
};
