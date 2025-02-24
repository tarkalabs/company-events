'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import EventList from './EventList';

export default function EventsPage() {
  const router = useRouter();

  useEffect(() => {
    const user = localStorage.getItem('user');
    if (!user) {
      router.push('/login');
    }
  }, [router]);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 text-white">Available Events</h1>
      <EventList />
    </div>
  );
} 