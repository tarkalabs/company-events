'use client';

import { usePathname } from 'next/navigation';
import UserProfile from './UserProfile';

export default function ClientLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();

    // Don't show the layout on login pages
    if (pathname === '/login' || pathname === '/admin/login') {
        return <>{children}</>;
    }

    return (
        <div className="min-h-screen">
            <header className="bg-black/20 backdrop-blur-lg">
                <div className="container mx-auto px-4 py-4 flex justify-between items-center">
                    <h1 className="text-2xl font-bold text-white">Company Events</h1>
                    {!pathname.startsWith('/admin') && <UserProfile />}
                </div>
            </header>
            {children}
        </div>
    );
} 