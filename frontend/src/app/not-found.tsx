'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';

const NotFound = () => {
  const pathname = usePathname();

  useEffect(() => {
    console.error('404 Error: User attempted to access non-existent route:', pathname);
  }, [pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      <div className="text-center px-4">
        <h1 className="text-6xl font-bold mb-4">404</h1>
        <p className="text-xl mb-6">Oops! Page not found</p>
        <Link href="/" className="text-blue-600 hover:underline">
          Return to Home
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
