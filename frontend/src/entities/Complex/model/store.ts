import { create } from 'zustand';

import { complexApi } from '../api/api';
import { Apartament, Block, Complex } from './types';
import { Developer } from '@/entities/Developer';

interface ComplexState {
    allComplexes: Complex[];      // все комплексы (1 раз загружаются с API)
    complexes: Complex[];         // те, что показываются на экране
    currentComplex: Complex | null;
    currentBlocks: Block[],
    currentApartaments: Apartament[],
    currentDeveloper: Developer[],
    page: number;
    pageSize: number;
    isLoading: boolean;
    error: string | null;
    filter: 'all' | 'ready' | 'planned' | 'construction';

    getBlockByComplexId: (complexId: number) => Promise<string>
    setFilter: (filter: ComplexState['filter']) => void;
    getFiltered: () => Complex[];
    fetchAllComplexes: () => Promise<void>;
    getComplexById: (complexId: number) => Promise<string>;
    getApartaments: (blockId: number) => Promise<string | void>
}

export const useComplexStore = create<ComplexState>((set, get) => ({
    complexes: [],
    currentBlocks: [],
    currentApartaments: [],
    allComplexes: [],
    currentDeveloper: [],
    currentComplex: null,

    isLoading: false,
    error: null,
    filter: 'all',
    page: 0,
    pageSize: 6,


    getComplexById: async (complexId) => {
        try {
            const state = get();
            const currentComplex = state.currentComplex;
            if (!currentComplex || currentComplex.id !== complexId) {
                const complex = await complexApi.getComplexById(complexId);

                if (complex) {
                    set({ currentComplex: complex });
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
    getBlockByComplexId: async (complexId: number): Promise<string> => {
        try {
            const state = get();
            const currentComplex = state.currentComplex;
            if (!currentComplex || currentComplex.id !== complexId) {
                const block = await complexApi.getBlocksByComplexId(complexId);
                if (block) {
                    set({ currentBlocks: block });
                    return 'success';
                } else {
                    return 'not_found';
                }
            }

            return 'success';
        } catch (error) {
            console.error('Ошибка загрузки блока:', error);
            return 'error';
        }
    },
    setFilter: (filter) => set({ filter }),
    fetchAllComplexes: async () => {
        set({ isLoading: true, error: null });
        try {
            const state = get();
            let allComplexes = state.allComplexes;
            if (allComplexes.length === 0) {
                allComplexes = await complexApi.getAllComplexes();
                set({ allComplexes });
            }
            const { page, pageSize, complexes } = get();
            const start = page * pageSize;
            const end = start + pageSize;
            const newSlice = allComplexes.slice(start, end);

            set({
                complexes: [...complexes, ...newSlice],
                page: page + 1,
                isLoading: false,
            });
        } catch (e: unknown) {
            console.error(e);
            const message =
                e instanceof Error ? e.message : 'Ошибка загрузки комплексов';
            set({ error: message, isLoading: false });
        }
    },
    getFiltered() {
        const { filter, complexes } = get();
        if (filter === 'all') return complexes;
        return complexes.filter(c => c.status === filter);
    },
    getApartaments: async (blockId: number): Promise<'success' | 'error'> => {
        try {
            const apartaments = await complexApi.getApartamentById(blockId);

            if (Array.isArray(apartaments)) {
                set({ currentApartaments: apartaments });
                return 'success';
            } else {
                console.error('Некорректный ответ от API:', apartaments);
                return 'error';
            }
        } catch (error) {
            console.error('Ошибка загрузки квартир:', error);
            return 'error';
        }
    }
}));