import React, { useRef, forwardRef, useImperativeHandle } from "react";
import { StyleSheet } from "react-native";
import { Platform } from "react-native";

import { Input } from "@/components/ui/input";
import { Text } from "@/components/ui/text";

import * as S from "./styles";

const CODE_LENGTH = 4;

const autoComplete = Platform.select({
  android: "sms-otp",
  default: "one-time-code",
});

const baseInputStyle = {
  ...StyleSheet.absoluteFillObject,
  width: 0,
  height: 0,
  opacity: 0,
  color: "transparent",
};

const inputStyle = { ...baseInputStyle };

export const CodeInput = forwardRef(
  (
    {
      length = CODE_LENGTH,
      value = "",
      disabled = false,
      onChange = (text) => {},
      ...rest
    },
    ref
  ) => {
    const inputRef = useRef(null);

    const cleaner = (text) => text.replace(/\s+/g, "");

    useImperativeHandle(ref, () => ({
      focus: () => inputRef.current?.focus(),
      blur: () => inputRef.current?.blur(),
      clear: () => inputRef.current?.clear(),
      get value() {
        return inputRef.current?.value;
      },
      set value(v) {
        if (inputRef.current) {
          inputRef.current.setNativeProps({ text: v });
          onChange(cleaner(v));
        }
      },
    }));

    const handlePress = () => {
      inputRef.current?.focus();
    };

    return (
      <S.Container activeOpacity={1} onPress={handlePress}>
        <Input
          {...rest}
          disabled={disabled}
          aria-disabled={disabled}
          ref={inputRef}
          value={value}
          onChangeText={(text) => onChange(cleaner(text))}
          keyboardType="number-pad"
          autoComplete={autoComplete}
          textContentType="oneTimeCode"
          maxLength={length}
          caretHidden
          style={inputStyle}
        />
        {Array.from({ length }).map((_, index) => {
          const char = value[index] || "";
          const isFocused = value.length === index && !disabled;

          return (
            <S.Cell key={index} $focused={isFocused} $disabled={disabled}>
              <Text fontSize="xl" fontWeight="semibold">
                {char}
              </Text>
            </S.Cell>
          );
        })}
      </S.Container>
    );
  }
);
