import { Fragment } from "react";
import { Keyboard } from "react-native";
import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye } from "lucide-react-native";

import { authenticate } from "@/mutations/authenticate";
import { Field } from "@/components/field";
import { Button } from "@/components/ui/button";
import { Input, InputPassword } from "@/components/ui/input";
import { Formatter } from "@/sdk/formatter";
import { buildLoginPayload } from "@/sdk/auth";
import { cpfScheme, passwordScheme } from "@/zodSchemes";
import * as S from "./styles";

const formScheme = z.object({
  cpf: cpfScheme(),
  password: passwordScheme(),
});

export const Form = () => {
  const { mutate, isPending } = authenticate();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    mode: "onChange",
    resolver: zodResolver(formScheme),
    defaultValues: {
      cpf: "",
      password: "",
    },
  });

  const onSubmit = (values) => {
    Keyboard.dismiss();
    if (isPending) return;
    mutate(buildLoginPayload(values));
  };

  return (
    <Fragment>
      <S.Form>
        <Field
          component={
            <Controller
              name="cpf"
              control={control}
              render={({ field }) => (
                <Input
                  inputMode="numeric"
                  placeholder="CPF"
                  onBlur={field.onBlur}
                  onChangeText={(text) => field.onChange(Formatter.cpf(text))}
                  value={field.value}
                  onKeyPress={(event) => {
                    if (event.nativeEvent.key === "Enter") {
                      handleSubmit(onSubmit)();
                    }
                  }}
                />
              )}
            />
          }
          error={errors.cpf && errors.cpf.message}
        />
        <Field
          component={
            <Controller
              name="password"
              control={control}
              render={({ field }) => (
                <InputPassword
                  placeholder="Senha"
                  onBlur={field.onBlur}
                  onChangeText={field.onChange}
                  value={field.value}
                  onKeyPress={(event) => {
                    if (event.nativeEvent.key === "Enter") {
                      handleSubmit(onSubmit)();
                    }
                  }}
                />
              )}
            />
          }
          error={errors.password && errors.password.message}
        />
      </S.Form>
      <Button size="lg" onPress={handleSubmit(onSubmit)} loading={isPending}>
        Entrar
      </Button>
    </Fragment>
  );
};
