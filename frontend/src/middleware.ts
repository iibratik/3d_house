import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { privateRoutes } from './app/routes';

const supportedLocales = ['ru', 'en'];
const defaultLocale = 'ru';



// Получить путь без локали: /ru/dashboard → /dashboard
function stripLocale(pathname: string): string {
    const segments = pathname.split('/');
    if (supportedLocales.includes(segments[1])) {
        return '/' + segments.slice(2).join('/');
    }
    return pathname;
}

function hasLocale(pathname: string): boolean {
    const firstSegment = pathname.split('/')[1];
    return supportedLocales.includes(firstSegment);
}

export function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;

    // 🚫 Не трогаем статические файлы и API
    const isStatic = pathname.match(/^\/(_next|favicon.ico|api|3dModels|static|images|fonts)\b/);
    if (isStatic) return NextResponse.next();

    // 🌐 Добавить локаль, если нет
    if (!hasLocale(pathname)) {
        const newUrl = request.nextUrl.clone();
        newUrl.pathname = `/${defaultLocale}${pathname}`;
        return NextResponse.redirect(newUrl);
    }

    // 🧠 Проверка авторизации
    const pathWithoutLocale = stripLocale(pathname);
    const isPrivate = privateRoutes.some(route => pathWithoutLocale.startsWith(route));

    const token = request.cookies.get('authToken')?.value;

    if (isPrivate && !token) {
        const locale = pathname.split('/')[1] || defaultLocale;
        const loginUrl = new URL(`/${locale}/login`, request.url);
        loginUrl.searchParams.set('from', pathname);
        return NextResponse.redirect(loginUrl);
    }

    return NextResponse.next();
}

export const config = {
    matcher: ['/((?!.*\\.).*)'], // только HTML-пути, исключает .js, .png и т.п.
};
