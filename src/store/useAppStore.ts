import { create } from 'zustand';
export const useAppStore = create<{ ready: boolean; error: string | null; setReady: () => void; setError: (error: string) => void }>(set => ({
  ready: false, error: null,
  setReady: () => set({ ready: true, error: null }),
  setError: error => set({ ready: false, error }),
}));
