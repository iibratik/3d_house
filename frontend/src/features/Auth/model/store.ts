import { create } from 'zustand';
import { loginRequest } from '../api/login';
import { useDeveloperStore } from '@/entities/Developer/model/store';

export interface AuthState {
    error: string | null;
    login: (username: string, password: string) => Promise<void>;
    logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
    error: '',
    login: async (username: string, password: string): Promise<void> => {
        try {
            const currentDeveloper = await loginRequest(username, password);

            useDeveloperStore.getState().setCurrentDeveloper(currentDeveloper);
            localStorage.setItem('developerId', `${currentDeveloper.id}`)
            document.cookie = `authToken=fake-token-${Date.now()}; path=/; max-age=86400`;

            // Очистить ошибку
            set({ error: null });
        } catch (err: unknown) {
            const errorMessage = err instanceof Error ? err.message : String(err);

            // Удалить cookie и localStorage на случай ошибки
            document.cookie = 'authToken=; path=/; max-age=0';

            set({ error: errorMessage });
        }
    },

    logout: () => {
        fetch('/api/logout', { method: 'POST' });
    },
}));
