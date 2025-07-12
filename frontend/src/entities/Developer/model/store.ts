import { create } from 'zustand';
import { developerApi } from '../api/api';
import { Developer } from './types';
import { Complex } from '@/entities/Complex';

// Структура стора для работы с застройщиками и их комплексами
interface DeveloperStore {
    currentDeveloper: Developer | null;
    developerComplexes: Complex[];

    setCurrentDeveloper: (developer: Developer) => void;
    getDeveloperById: (developerId: number) => Promise<'success' | 'not_found' | 'error'>;
    getDeveloperComplexes: (developerId: number) => Promise<'success' | 'not_found' | 'error'>;
}

export const useDeveloperStore = create<DeveloperStore>((set) => ({
    currentDeveloper: null,
    developerComplexes: [],
    setCurrentDeveloper: (developer) => set({ currentDeveloper: developer }),
    getDeveloperById: async (developerId) => {
        try {
            if (!developerId) {
                return 'not_found';
            }
            const developer = await developerApi.getByDeveloperId(developerId);
            if (developer) {
                set({ currentDeveloper: developer });
                return 'success';
            }
            return 'not_found';
        } catch (error) {
            console.error('Ошибка загрузки застройщика по ID:', error);
            return 'error';
        }
    },

    getDeveloperComplexes: async (developerId) => {
        try {
            if (!developerId) {
                return 'not_found';
            }
            const complexes = await developerApi.getAllComplexesByDeveloperId(developerId);
            if (Array.isArray(complexes) && complexes.length > 0) {
                set({ developerComplexes: complexes });
                return 'success';
            }
            return 'not_found';
        } catch (error) {
            console.error('Ошибка загрузки комплексов застройщика:', error);
            return 'error';
        }
    }
}));
