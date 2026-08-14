import {
  toast,
  ToastPosition,
  Toasts,
} from "@backpackapp-io/react-native-toast";

const DEFAULT_DURATION = 6000;
const DEFAULT_FONT_FAMILY = "Outfit-Regular";

const toastProps = {
  id: "giftpay-family-single-toast",
  position: ToastPosition.TOP,
  duration: DEFAULT_DURATION,
  styles: {
    text: {
      fontFamily: DEFAULT_FONT_FAMILY,
    },
  },
};

export const ToastsRoot = function ToastsRoot() {
  return <Toasts />;
};

export const ToastSuccess = (message = "", options = {}) =>
  toast.success(message, {
    ...toastProps,
    ...options,
  });

export const ToastError = (message = "", options = {}) =>
  toast.error(message, {
    ...toastProps,
    ...options,
  });

export const ToastInfo = (message = "", options = {}) =>
  toast(message, {
    ...toastProps,
    ...options,
  });
