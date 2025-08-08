import { $api } from '@/shared/api/base';
import { Apartament, Block, Complex } from '../model/types';

export const complexApi = {
  async getAllComplexes(): Promise<Complex[]> {
    try {
      const response = await $api.get<Complex[]>('/apar/get/all/complex');
      return response.data;
    } catch (err) {
      console.error('Ошибка при получении комплексов', err);
      throw err;
    }
  },
  async getComplexById(complexId: number): Promise<Complex> {
    const response = await $api.get<Complex[]>(`/apar/get/complex/id?id=${complexId}`);

    if (Array.isArray(response.data) && response.data.length > 0) {
      return response.data[0];
    }

    throw new Error(`Complex with id=${complexId} not found`);
  },
  async getBlocksByComplexId(complexId: number): Promise<Block[]> {
    try {
      const response = await $api.get<Block[]>(`apar/get/block/id?id=${complexId}`);

      if (Array.isArray(response.data) && response.data.length > 0) {
        return response.data;
      }
      return [];
    } catch (error) {
      console.error(`🔥 Ошибка при получении блоков для complexId=${complexId}:`, error);
      return []; // Возвращаем пустой массив, чтобы не ронять приложение
    }
  },
  async getApartamentById(blockId: number): Promise<Apartament[]> {
    const response = await $api.get<Apartament[]>(`/apar/get/apartment?blockId=${blockId}`);
    if (response.status !== 200) {
      throw new Error(`Request failed with status ${response.status}`);
    }
    if (!Array.isArray(response.data)) {
      throw new Error(`No apartments found`);
    }

    return response.data;
  },
  async createApartament(apartament: Apartament): Promise<string> {


    const response = await $api.post<string>(`/apar/add/apartment`, JSON.stringify(apartament));
    return response.data

  }
};