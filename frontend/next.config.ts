import { NextConfig } from 'next';

const nextConfig: NextConfig = {
    images: {
        domains: ['images.icon-icons.com'], // Разрешаем загрузку изображений с внешнего домена
    },
    async rewrites() {
        return [
            {
                source: '/api/backend/:path*',
                destination: 'http://localhost:8000/:path*' // Прокси на Spring Boot API
            }
        ];
    },
    assetPrefix: '/',     // Важный параметр: относительные пути
    basePath: '',         // Сайт будет доступен на https://3devor.uz/
    output: 'standalone', // Для Docker или продакшн-сборки
};

export default nextConfig;
