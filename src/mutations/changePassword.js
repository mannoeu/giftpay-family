import { useMutation } from "@tanstack/react-query";

import { AuthController } from "@/controller";
import { useAuthStore } from "@/store/auth";
import { ToastSuccess } from "@/sdk/toast";

export const changePassword = () => {
  const setFirstAccess = useAuthStore((state) => state.setFirstAccess);

  return useMutation({
    mutationFn: ({ password }) => AuthController.changePassword({ password }),
    onSuccess: () => {
      setFirstAccess(false);
      ToastSuccess("Senha criada com sucesso");
    },
  });
};
