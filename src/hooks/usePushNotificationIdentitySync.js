import { useEffect } from "react";

import { useAuthStore } from "@/store/auth";
import {
  addEmail,
  addTags,
  pushNotificationLogin,
} from "@/sdk/push-notification";

/**
 * Sincroniza identidade do usuário autenticado com o OneSignal.
 * Chame dentro de um componente que só renderiza quando há sessão.
 */
export const usePushNotificationIdentitySync = () => {
  const token = useAuthStore((state) => state.token);
  const isAuthenticated = !!token?.access_token;

  useEffect(() => {
    if (!isAuthenticated) return;

    // Substitua pelos dados do usuário autenticado quando disponíveis.
    // Exemplo: pushNotificationLogin(user.onesignal_uuid);
    //          addEmail(user.email);
    //          addTags({ uuid: user.onesignal_uuid });
  }, [isAuthenticated]);
};
