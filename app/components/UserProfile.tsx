'use client';

import { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';

const colors = [
    '#f44336', '#e91e63', '#9c27b0', '#673ab7', '#3f51b5',
    '#2196f3', '#03a9f4', '#00bcd4', '#009688', '#4caf50'
];

export default function UserProfile() {
    const router = useRouter();
    const [user, setUser] = useState<{ username: string; businessUnit: string } | null>(null);
    const [bgColor] = useState(() => colors[Math.floor(Math.random() * colors.length)]);
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const userData = localStorage.getItem('user');
        if (userData) {
            setUser(JSON.parse(userData));
        }

        // Close dropdown when clicking outside
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    if (!user) return null;

    const initials = user.username
        .split(' ')
        .map(name => name[0])
        .join('')
        .toUpperCase();

    const handleLogout = () => {
        // Clear user data
        localStorage.removeItem('user');
        document.cookie = 'user=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT';
        router.push('/login');
    };

    return (
        <div className="relative" ref={dropdownRef}>
            <div
                className="flex items-center gap-3 group cursor-pointer"
                onClick={() => setIsOpen(!isOpen)}
            >
                <div
                    className="w-10 h-10 rounded-full flex items-center justify-center text-white text-sm font-medium 
                             shadow-lg transition-transform duration-200 group-hover:scale-110"
                    style={{ backgroundColor: bgColor }}
                >
                    {initials}
                </div>
                <div className="flex flex-col">
                    <span className="text-white font-medium">{user.username}</span>
                    <span className="text-white/70 text-sm">{user.businessUnit}</span>
                </div>
            </div>

            {isOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-xl py-1 z-50">
                    <div className="px-4 py-3 border-b border-gray-100">
                        <p className="text-sm font-medium text-gray-900">{user.username}</p>
                        <p className="text-sm text-gray-500">{user.businessUnit}</p>
                    </div>
                    <button
                        onClick={handleLogout}
                        className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors flex items-center gap-2"
                    >
                        <svg
                            className="w-4 h-4"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                            />
                        </svg>
                        Sign out
                    </button>
                </div>
            )}
        </div>
    );
} 