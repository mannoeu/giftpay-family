import { useState, forwardRef } from "react";
import { useFocused } from "./useFocused";

import { Checkbox } from "@/components/ui/checkbox";

import * as S from "./styles";

export const Input = forwardRef(
  ({ onFocus, onBlur, editable = true, insideBottomSheet, ...rest }, ref) => {
    const { focused, onFocusHandler, onBlurHandler } = useFocused({
      onFocus,
      onBlur,
    });

    const InputComponent = insideBottomSheet ? S.BottomSheetInput : S.Input;

    return (
      <InputComponent
        {...rest}
        ref={ref}
        editable={editable}
        focused={focused}
        onFocus={onFocusHandler}
        onBlur={onBlurHandler}
      />
    );
  }
);

export const InputPassword = forwardRef(
  ({ onFocus, onBlur, editable = true, ...rest }, ref) => {
    const [showPassword, setShowPassword] = useState(false);
    const { focused, onFocusHandler, onBlurHandler } = useFocused({
      onFocus,
      onBlur,
    });

    return (
      <S.Container>
        <Input
          {...rest}
          ref={ref}
          editable={editable}
          secureTextEntry={!showPassword}
          focused={focused}
          onFocus={onFocusHandler}
          onBlur={onBlurHandler}
        />
        <Checkbox
          checked={showPassword}
          onChange={setShowPassword}
          label="Mostrar senha"
        />
      </S.Container>
    );
  }
);
