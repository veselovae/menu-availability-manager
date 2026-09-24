import { create } from "zustand";

interface StopListUiState {
  selectedItemId: string | null;
  isPanelOpen: boolean;

  openPanel: (itemId: string) => void;
  closePanel: () => void;
}

export const useStopListUiStore = create<StopListUiState>((set) => ({
  selectedItemId: null,
  isPanelOpen: false,

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
}));
