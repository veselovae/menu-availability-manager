import { create } from "zustand";

interface StopListUiState {
  selectedItemId: string | null;
  isPanelOpen: boolean;
  toastMessage: string | null;
  toastVariant: "success" | "error";
  toastId: number;

  openPanel: (itemId: string) => void;
  closePanel: () => void;
  showToast: (message: string, variant?: "success" | "error") => void;
  hideToast: () => void;
}

export const useStopListUiStore = create<StopListUiState>((set) => ({
  selectedItemId: null,
  isPanelOpen: false,
  toastMessage: null,
  toastVariant: "error",
  toastId: 0,

  openPanel: (itemId) => {
    set({
      selectedItemId: itemId,
      isPanelOpen: true,
    });
  },

  closePanel: () => {
    set({
      selectedItemId: null,
      isPanelOpen: false,
    });
  },

  showToast: (message, variant = "error") => {
    set((state) => ({
      toastMessage: message,
      toastVariant: variant,
      toastId: state.toastId + 1,
    }));
  },

  hideToast: () => {
    set({ toastMessage: null });
  },
}));
