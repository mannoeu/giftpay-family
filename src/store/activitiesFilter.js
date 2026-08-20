import { create } from "zustand";
import { immer } from "zustand/middleware/immer";

export const normalizeActivitiesParentId = (parentId) => {
  if (parentId == null || parentId === "") return null;

  const asNumber = Number(parentId);
  return Number.isFinite(asNumber) ? asNumber : parentId;
};

export const useActivitiesFilterStore = create(
  immer((set) => ({
    parentId: null,
    setParentId: (parentId) => {
      set((state) => {
        state.parentId = normalizeActivitiesParentId(parentId);
      });
    },
    reset: () => {
      set((state) => {
        state.parentId = null;
      });
    },
  })),
);
