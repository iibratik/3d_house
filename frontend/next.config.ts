import { NextConfig } from 'next';
import createNextIntlPlugin from 'next-intl/plugin';

const nextConfig: NextConfig = {
    images: {
        domains: ['images.icon-icons.com'], // ✅ Разрешаем внешний домен
    },
    async rewrites() {
        return [
            {
                source: '/api/back/:path*',
                destination: 'http://localhost:8000/api/back/:path*'
            }
        ];
    }
};

const withNextIntl = createNextIntlPlugin(

);
export default withNextIntl(nextConfig);
