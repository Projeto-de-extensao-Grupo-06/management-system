import { create } from 'zustand';
import type User from '../interfaces/types/User';
import { getCookie, deleteCookie } from '../utils/cookieUtils';

interface AuthState {
    user: User | null;
    isAuthenticated: boolean;
    setUser: (user: User) => void;
    checkAuth: () => void;
    clearUser: () => void;
}

const useAuthStore = create<AuthState>((set) => ({
    user: null,
    isAuthenticated: false,
    setUser: (user) => set({ user, isAuthenticated: true }),
    checkAuth: () => {
        const firstName = getCookie('userFirstName');
        const lastName = getCookie('userLastName');
        const authoritiesCookie = getCookie('userAuthorities');

        if (firstName && lastName && authoritiesCookie) {
            try {
                const decodedAuthorities = atob(authoritiesCookie);
                const authorities = decodedAuthorities.replace(/[\[\]]/g, '').split(',').map(a => a.trim());

                set({
                    user: {
                        firstName,
                        lastName,
                        authorities
                    },
                    isAuthenticated: true
                });
            } catch (e) {
                console.error('Failed to parse auth cookies', e);
                set({ user: null, isAuthenticated: false });
            }
        }
    },
    clearUser: () => {
        deleteCookie('userFirstName');
        deleteCookie('userLastName');
        deleteCookie('userAuthorities');
        set({ user: null, isAuthenticated: false });
    },
}));

export default useAuthStore;
