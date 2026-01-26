import { create } from "zustand";
import type { RightPanelState, RightPanelView } from "../types";

const useRightPanel = create<RightPanelState>((set) => ({
  currentView: "chat",
  setCurrentView: (currentView: RightPanelView) => set({ currentView }),
}));

export default useRightPanel;
