import { NextConfig } from 'next';
import createNextIntlPlugin from 'next-intl/plugin';

const nextConfig: NextConfig = {
    async rewrites() {
        return [
            {
                source: '/api/backend/:path*',
                destination: 'http://localhost:8000/:path*' // Spring API
            }
        ];
    }
};

const withNextIntl = createNextIntlPlugin(

);
export default withNextIntl(nextConfig);
