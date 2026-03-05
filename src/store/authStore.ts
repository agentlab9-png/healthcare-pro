import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { type User } from '../types';

interface AuthState {
    user: (User & { token?: string, doctorId?: string, patientId?: string }) | null;
    isAuthenticated: boolean;
    login: (userData: { user: User & { token?: string, doctorId?: string, patientId?: string }, token: string }) => void;
    logout: () => void;
}

export const useAuthStore = create<AuthState>()(
    persist(
        (set) => ({
            user: null,
            isAuthenticated: false,
            login: (userData) => set({
                user: userData.user,
                isAuthenticated: true
            }),
            logout: () => set({
                user: null,
                isAuthenticated: false
            }),
        }),
        {
            name: 'healthcare-auth',
        }
    )
);
