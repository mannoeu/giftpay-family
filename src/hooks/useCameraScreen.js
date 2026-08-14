import { useCallback } from "react";
import { useRouter } from "expo-router";
import { Camera } from "expo-camera";

import { useSheet } from "@/store/sheet";
import { ToastError } from "@/sdk/toast";

export const useCameraScreen = () => {
  const router = useRouter();
  const openSheet = useSheet((state) => state.openSheet);

  const openCamera = useCallback(
    async (position = "front") => {
      try {
        const updatedPermission = await Camera.getCameraPermissionsAsync();

        const goToCameraScreen = () => {
          router.push(`/camera?position=${position}`);
        };

        if (!updatedPermission.granted) {
          // Abra aqui um sheet de permissão quando necessário
          goToCameraScreen();
        } else {
          goToCameraScreen();
        }
      } catch (error) {
        ToastError(
          "Ocorreu um erro ao tentar acessar a câmera. Tente novamente."
        );
      }
    },
    [openSheet]
  );

  return { openCamera };
};
