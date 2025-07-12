'use client';

import { usePathname } from 'next/navigation';
import { ReactNode } from 'react';
import { Navigation } from '@/widgets/Navigation';

const hiddenNavbarPaths = ['/login', '/register', '/reset-password'];

export function ClientWrapper({ children }: { children: ReactNode }) {
    const pathname = usePathname();
    const pathWithoutLocale = pathname.replace(/^\/[a-z]{2}(\/|$)/, '/');

    const hideNavbar = hiddenNavbarPaths.some((path) =>
        pathWithoutLocale.startsWith(path)
    );

    return (
        <>
            {!hideNavbar && <Navigation />}
            {children}
        </>
    );
}
