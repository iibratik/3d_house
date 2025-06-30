import { $api } from '@/shared/api/base';
import { Developer } from '../model/types';

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
    }
};