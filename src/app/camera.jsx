import { useRef, useCallback, useState } from "react";
import { View } from "react-native";
import * as Linking from "expo-linking";
import { useFocusEffect, useLocalSearchParams, useRouter } from "expo-router";
import { CameraView, useCameraPermissions } from "expo-camera";
import * as ImageManipulator from "expo-image-manipulator";
import * as ImagePicker from "expo-image-picker";
import { useSharedValue } from "react-native-reanimated";

import { Text } from "@/components/ui/text";
import { Button } from "@/components/ui/button";
import { CaptureButton } from "@/components/camera/captureButton";
import { Gallery, FlipCamera } from "@/components/camera/controls";

import { useCameraStore } from "@/store/camera";
import { ToastError } from "@/sdk/toast";

import * as S from "@/styles/camera";

const AvailablePositions = {
  front: "front",
  back: "back",
};

export default function CameraScreen() {
  const router = useRouter();
  const { position } = useLocalSearchParams();
  const { setPicture } = useCameraStore();

  const cameraRef = useRef(null);
  const isPressingButton = useSharedValue(false);

  const [isCameraActive, setIsCameraActive] = useState(false);
  const [facing, setFacing] = useState(
    [AvailablePositions.back, AvailablePositions.front].includes(position)
      ? position
      : AvailablePositions.back
  );
  const [permission, requestPermission] = useCameraPermissions();

  useFocusEffect(
    useCallback(() => {
      setIsCameraActive(true);

      return () => {
        setIsCameraActive(false);
      };
    }, [])
  );

  const toggleCameraFacing = useCallback(() => {
    setFacing((current) =>
      current === AvailablePositions.back
        ? AvailablePositions.front
        : AvailablePositions.back
    );
  }, [setFacing]);

  const pickImageFromGallery = useCallback(async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled) {
      setPicture(result.assets[0]);
      router.back();
    }
  }, []);

  const setIsPressingButton = useCallback(
    (_isPressingButton) => {
      isPressingButton.value = _isPressingButton;
    },
    [isPressingButton]
  );

  function handleRequestCameraPermission() {
    requestPermission().then((result) => {
      const { canAskAgain, granted } = result;

      if (!granted) {
        if (!canAskAgain) {
          Linking.openSettings();
        } else {
          ToastError("Você precisa conceder acesso à câmera para continuar.");
        }
      }
    });
  }

  async function takePicture() {
    try {
      if (!cameraRef.current) return;

      const picture = await cameraRef.current.takePictureAsync({
        exif: false,
        skipProcessing: true,
      });

      const finalPicture = await ImageManipulator.manipulateAsync(
        picture?.uri,
        [{ rotate: 0 }],
        { compress: 1, format: ImageManipulator.SaveFormat.JPEG }
      );

      setPicture(finalPicture);
      router.back();
    } catch (error) {
      ToastError("Um erro ocorreu ao tirar a foto. Tente novamente.");
    }
  }

  if (!permission) {
    return <View />;
  }

  if (!permission.granted) {
    return (
      <S.Container>
        <S.Permissions>
          <Text fontWeight="bold" textAlign="center">
            Permissão para acessar a câmera
          </Text>
          <Text textAlign="center">
            Para continuar precisamos da sua permissão para acessar a câmera do
            seu dispositivo e tirar fotos.
          </Text>
          <S.Actions>
            <Button onPress={handleRequestCameraPermission}>Continuar</Button>
          </S.Actions>
        </S.Permissions>
      </S.Container>
    );
  }

  return (
    <S.CameraContainer>
      {isCameraActive && (
        <CameraView
          style={{ flex: 1 }}
          facing={facing}
          ref={cameraRef}
          mirror={true}
        >
          <S.CameraButtons>
            <Gallery onPress={pickImageFromGallery} />
            <CaptureButton
              camera={cameraRef}
              onPress={takePicture}
              setIsPressingButton={setIsPressingButton}
              cameraPosition={facing}
            />
            <FlipCamera onPress={toggleCameraFacing} />
          </S.CameraButtons>
        </CameraView>
      )}
    </S.CameraContainer>
  );
}
