import * as Linking from "expo-linking";
import * as Clipboard from "expo-clipboard";

import { contactEmail } from "@/sdk/constants";
import { ToastSuccess } from "@/sdk/toast";

export const openSupportEmail = async () => {
  await Clipboard.setStringAsync(contactEmail);
  ToastSuccess("O e-mail foi copiado para a área de transferência.");

  try {
    await Linking.openURL(`mailto:${contactEmail}`);
  } catch {
    // Sem app de e-mail: o endereço já está na área de transferência.
  }
};
