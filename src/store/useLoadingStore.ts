import { create } from "zustand";

interface LoadingState {
  activeRequests: number;
  isLoading: boolean;
  increment: () => void;
  decrement: () => void;
}

export const useLoadingStore = create<LoadingState>((set) => ({
  activeRequests: 0,
  isLoading: false,
  increment: () =>
    set((state) => {
      const activeRequests = state.activeRequests + 1;
      return { activeRequests, isLoading: activeRequests > 0 };
    }),
  decrement: () =>
    set((state) => {
      const activeRequests = Math.max(state.activeRequests - 1, 0);
      return { activeRequests, isLoading: activeRequests > 0 };
    }),
}));
