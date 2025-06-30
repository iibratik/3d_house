import { create } from 'zustand';
import { developerApi } from '../api/api';
import { Developer } from './types';

interface DeveloperStore {
    currentDeveloper: Developer | null
    getDeveloperById: (developerId: number) => Promise<string | null>;
}

export const useDeveloperStore = create<DeveloperStore>((set) => ({
    currentDeveloper: null,

    getDeveloperById: async (developerId) => {
        try {
            if (developerId) {
                const developer = await developerApi.getByDeveloperId(developerId);
                if (developer) {
                    set({ currentDeveloper: developer });
                    return 'success';
                } else {
                    return 'not_found';
                }
            }

            return 'success';
        } catch (error) {
            console.error('Ошибка загрузки комплекса:', error);
            return 'error';
        }
    },
}));