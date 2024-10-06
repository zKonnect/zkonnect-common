import { create } from "zustand";

type PreviewStore = {
  isPreviewOpen: boolean;
  toggle: () => void;
};

export const usePreview = create<PreviewStore>((set, get) => ({
  isPreviewOpen: false,
  toggle: () => set({ isPreviewOpen: !get().isPreviewOpen }),
}));
