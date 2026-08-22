import { create } from "zustand";
import { immer } from "zustand/middleware/immer";

export const DEPOSITS_FILTER_ALL = null;

export const normalizeDepositsStatus = (status) => {
  if (status == null || status === "") return DEPOSITS_FILTER_ALL;

  return status;
};

export const useDepositsFilterStore = create(
  immer((set) => ({
    status: DEPOSITS_FILTER_ALL,
    setStatus: (status) => {
      set((state) => {
        state.status = normalizeDepositsStatus(status);
      });
    },
    reset: () => {
      set((state) => {
        state.status = DEPOSITS_FILTER_ALL;
      });
    },
  })),
);
