import { create } from "zustand";
import { persist } from "zustand/middleware";

interface GlobalState {
  isSidebarOpen: boolean;
  apiKey: string;
  setIsSidebarOpen: (val: boolean) => void;
  setApiKey: (key: string) => void;
  clearApiKey: () => void;
}

export const useGlobalStore = create<GlobalState>()(
  persist(
    (set) => ({
      isSidebarOpen: true,
      apiKey: "",
      setIsSidebarOpen: (val) => set(() => ({ isSidebarOpen: val })),
      setApiKey: (key) => set(() => ({ apiKey: key })),
      clearApiKey: () => set(() => ({ apiKey: "" }))
    }),
    {
      name: "merkle-chat-storage", // unique name for localStorage key
      partialize: (state) => ({
        apiKey: state.apiKey,
        isSidebarOpen: state.isSidebarOpen
      }) // only persist these fields
    }
  )
);
