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
    // Если массив пустой — выбрасываем ошибку или возвращаем заглушку
    throw new Error(`Complex with id=${complexId} not found`);
  },
  async getBlocksByComplexId(complexId: number): Promise<Block[]> {
    const response = await $api.get<Block[]>(`/apar/get/block/id?id=${complexId}`)

    if (Array.isArray(response.data) && response.data.length > 0) {
      return response.data;
    }
    // Если массив пустой — выбрасываем ошибку или возвращаем заглушку
    throw new Error(`Block with id=${complexId} not found`);
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
  }
};