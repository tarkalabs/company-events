'use client';

import { useEffect, useState } from 'react';

export default function DatabasePage() {
    const [storageItems, setStorageItems] = useState<[string, string][]>([]);

    useEffect(() => {
        const items: [string, string][] = [];
        for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            if (key) {
                items.push([key, localStorage.getItem(key) || '']);
            }
        }
        setStorageItems(items);
    }, []);

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-8">Local Database Contents</h1>
            <div className="space-y-4">
                {storageItems.map(([key, value]) => (
                    <div key={key} className="bg-white p-4 rounded-lg shadow">
                        <h3 className="font-semibold text-lg">{key}</h3>
                        <pre className="mt-2 bg-gray-100 p-2 rounded">
                            {JSON.stringify(JSON.parse(value), null, 2)}
                        </pre>
                    </div>
                ))}
            </div>
        </div>
    );
} 