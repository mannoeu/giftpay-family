import { useState } from "react";

export const useFocused = ({ onFocus, onBlur }) => {
  const [focused, setFocused] = useState(false);

  const onFocusHandler = (e) => {
    setFocused(true);
    onFocus?.(e);
  };

  const onBlurHandler = (e) => {
    setFocused(false);
    onBlur?.(e);
  };

  return { focused, onFocusHandler, onBlurHandler };
};
