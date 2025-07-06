import { $api } from '@/shared/api/base';
import { Developer } from '../model/types';
import { Complex } from '@/entities/Complex';

export const developerApi = {
    async getByDeveloperId(developerId: number): Promise<Developer | null> {
        const response = await $api.get(`developer/get/id?id=${developerId}`);
        if (Array.isArray(response.data) && response.data.length > 0) {
            return response.data[0];
        }
        return null
    },
    async getAllDevelopers(): Promise<Developer[]> {
        const response = await $api.get<Developer[]>('/developer/get/all');
        return response.data;
    },
    async getAllComplexesByDeveloperId(developerId: number): Promise<Complex[] | null> {
        const response = await $api.get<Complex[]>(`/apar/get/id?developerId=${developerId}`)
        if (Array.isArray(response.data) && response.data.length > 0) {
            return response.data;
        }
        return null
    }

};