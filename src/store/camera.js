import { create } from "zustand";
import { immer } from "zustand/middleware/immer";

export const useCameraStore = create(
  immer((set) => ({
    picture: null,
    setPicture: (picture) => {
      set((state) => {
        state.picture = picture;
      });
    },
    reset: () => {
      set((state) => {
        state.picture = null;
      });
    },
  }))
);
