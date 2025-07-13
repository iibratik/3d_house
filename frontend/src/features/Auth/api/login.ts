import { Developer } from '@/entities/Developer';
import { $api } from '@/shared/api/base';

export async function loginRequest(username: string, password: string): Promise<Developer> {
    try {
        // Создаем данные в формате application/x-www-form-urlencoded


        const response = await $api.post<Developer>(
            '/developer/login',
            {
                username,
                password,
            },
            {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                withCredentials: true, // ⚠️ обязательно для получения JSESSIONID
            }
        );

        if (response.status !== 200) {
            throw new Error('Ошибка авторизации');
        }


        return response.data;
    } catch (err) {
        console.error('🔴 Ошибка при логине', err);
        throw err;
    }
}