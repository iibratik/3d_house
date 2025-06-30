// app/layout.tsx
import './globals.css';
import { ReactNode } from 'react';
import { ThemeProvider } from '@/shared/providers/theme-provider';

export const metadata = {
  title: '3Devor',
  description: 'Платформа по поиску жилья',
  icons: {
    icon: '/images/favicon.ico',
  },
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="ru" className="dark" suppressHydrationWarning>
      <body>
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
