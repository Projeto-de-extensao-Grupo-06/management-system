import { create } from "zustand";

interface LoadingState {
  activeRequests: number;
  increment: () => void;
  decrement: () => void;
}

export const useLoadingStore = create<LoadingState>((set) => ({
  activeRequests: 0,
  increment: () =>
    set((state) => ({ activeRequests: state.activeRequests + 1 })),
  decrement: () =>
    set((state) => ({ activeRequests: Math.max(state.activeRequests - 1, 0) })),
}));
