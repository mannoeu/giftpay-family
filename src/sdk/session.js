import { queryClient } from "@/services/queryClient";
import { useAuthStore } from "@/store/auth";
import { useSheet } from "@/store/sheet";
import { pushNotificationLogout } from "@/sdk/push-notification";

export const handleLogout = () => {
  const signOut = useAuthStore.getState().signOut;
  const closeSheet = useSheet.getState().closeSheet;

  closeSheet();
  signOut();
  pushNotificationLogout();

  setTimeout(() => {
    queryClient.clear();
  });
};
