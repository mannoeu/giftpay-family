import { create } from "zustand";

export const useSheet = create((set, get) => ({
  content: null,
  isVisible: false,
  snapPoints: undefined,
  enablePanDownToClose: undefined,
  locked: false,
  /**
   * Abre um sheet. Se já houver um sheet `locked` e `force` não for true, ignora.
   * Retorna `true` se abriu/substituiu; `false` se bloqueado pelo lock.
   */
  openSheet: (content, options = {}) => {
    const { isVisible, locked } = get();

    if (isVisible && locked && !options.force) {
      return false;
    }

    set({
      content,
      isVisible: true,
      snapPoints: options.snapPoints,
      enablePanDownToClose: options.enablePanDownToClose,
      locked: !!options.locked,
    });

    return true;
  },
  closeSheet: () =>
    set({
      content: null,
      isVisible: false,
      snapPoints: undefined,
      enablePanDownToClose: undefined,
      locked: false,
    }),
}));
