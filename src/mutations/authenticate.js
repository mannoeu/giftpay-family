import { useMutation } from "@tanstack/react-query";

import { AuthController } from "@/controller";
import { useAuthStore } from "@/store/auth";

export const authenticate = () => {
  const setToken = useAuthStore((state) => state.setToken);

  const mutation = useMutation({
    mutationFn: ({ username, password }) =>
      AuthController.login({ username, password }),
    onSuccess: ({ data }) => {
      setToken({
        access_token: data?.access,
        refresh_token: data?.refresh,
        isFirstAccess: true, //!!data?.is_first_access,
      });
    },
  });

  return mutation;
};
