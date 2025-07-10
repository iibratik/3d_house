import { NextRequest, NextResponse } from 'next/server';
import { publicRoutes, privateRoutes } from './routes';

export function middleware(req: NextRequest) {
    const { pathname } = req.nextUrl;

    // Извлекаем locale и чистый путь
    const segments = pathname.split('/');
    const locale = segments[1] || 'en'; // например: /en/dashboard
    const routePath = '/' + segments.slice(2).join('/'); // убираем locale

    const token = req.cookies.get('accessToken')?.value;

    const isPublic = publicRoutes.includes(routePath);
    const isPrivate = privateRoutes.includes(routePath);

    if (isPrivate && !token) {
        return NextResponse.redirect(new URL(`/${locale}/login`, req.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: ['/((?!_next|static|favicon.ico).*)'],
};