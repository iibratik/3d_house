import { create } from 'zustand';

import { complexApi } from '../api/api';
import { Apartament, Block, Complex, ComplexFilters, } from './types';


interface ComplexState {
    allComplexes: Complex[];
    complexes: Complex[];
    currentComplex: Complex | null;
    currentBlocks: Block[],
    currentApartaments: Apartament[],
    currentFilters: ComplexFilters[],

    page: number;
    pageSize: number;
    isLoading: boolean;
    error: string | null;


    getBlockByComplexId: (complexId: number) => Promise<string>
    getFiltered: () => void;
    getFilterValues: () => void
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
    currentFilters: [],
    isLoading: false,
    error: null,
    page: 0,
    pageSize: 6,

    getFiltered: () => {
        const complexes = get().allComplexes
        const filters = get().currentFilters

        // Парсер диапазона цены
        const parsePriceRange = (str: string): { min: number; max: number } => {
            const min = 0, max = Infinity
            const toM = /до\s*(\d+(?:\.\d+)?)\s*млн/.exec(str)
            const overB = /свыше\s*(\d+(?:\.\d+)?)\s*млрд/.exec(str)
            const rng = /(\d+(?:\.\d+)?)\s*-\s*(\d+(?:\.\d+)?)/.exec(str)
            if (toM) return { min, max: +toM[1] * 1e6 }
            if (overB) return { min: +overB[1] * 1e9, max }
            if (rng) {
                const unit = str.includes('млрд') ? 1e9 : str.includes('млн') ? 1e6 : 1
                return { min: +rng[1] * unit, max: +rng[2] * unit }
            }
            return { min, max }
        }

        // Парсер диапазона площади
        const parseAreaRange = (str: string): { min: number; max: number } => {
            const m = /(\d+(?:\.\d+)?)\s*-\s*(\d+(?:\.\d+)?)/.exec(str)
            return m
                ? { min: +m[1], max: +m[2] }
                : { min: 0, max: Infinity }
        }

        const filtered = complexes.filter(cpx =>
            filters.every((f, idx) => {
                const val = f.filterValue
                // если фильтр не выбран или значение не входит в возможные варианты — пропускаем
                if (!val || !f.filterRanges.includes(val)) return true

                switch (idx) {
                    case 0: { // price
                        const { min, max } = parsePriceRange(val)
                        return cpx.price >= min && cpx.price <= max
                    }
                    case 1: { // city
                        const city = cpx.address.split(',')[0].trim()
                        return city === val
                    }
                    case 2: { // area
                        const { min, max } = parseAreaRange(val)
                        const sqMin = +cpx.squareMin
                        const sqMax = +cpx.squareMax
                        // пересечение диапазонов
                        return sqMax >= min && sqMin <= max
                    }
                    case 3: { // status
                        return cpx.status === val
                    }
                    default:
                        return true
                }
            })
        )

        set({ complexes: filtered })
    },
    getFilterValues() {
        const sorted = [...get().allComplexes].sort((a, b) => a.price - b.price)

        // 2) Собрать уникальные наборы для каждого фильтра
        const filterPrices = [...new Set(sorted.map(i => i.filterPrice))]
        const cities = [...new Set(sorted.map(i => i.address.split(',')[0].trim()))]
        const sizeRanges = [...new Set(sorted.map(i => `${i.squareMin} - ${i.squareMax} М²`))]
        const statuses = [...new Set(sorted.map(i => i.status))]

        const blocks: ComplexFilters[] = [
            {
                filterRanges: filterPrices,
                filterValue: 'Цена'  // можно задать дефолт по-другому
            },
            {
                filterRanges: cities,
                filterValue: 'Все города'
            },
            {
                filterRanges: sizeRanges,
                filterValue: 'Площадь'
            },
            {
                filterRanges: statuses,
                filterValue: 'Статусы'
            }
        ]
        set({ currentFilters: blocks })

    },
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