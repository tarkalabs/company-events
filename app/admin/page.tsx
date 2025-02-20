'use client';

import { useEffect, useState } from 'react';

interface Event {
  id: string;
  day: number;
  time: string;
  session: string;
  details: string | null;
}

export default function AdminPage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchEvents() {
      try {
        const response = await fetch('/api/admin/events');
        const data = await response.json();
        setEvents(data);
      } catch (error) {
        console.error('Error fetching events:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchEvents();
  }, []);

  if (loading) {
    return <div className="p-6 text-white">Loading...</div>;
  }

  return (
    <div className="p-6">
      <h2 className="text-3xl font-bold text-white mb-6">All Events</h2>
      <div className="space-y-4">
        {events.map((event) => (
          <div key={event.id} className="bg-white/10 backdrop-blur-lg border border-white/20 p-6 rounded-xl shadow-lg">
            <h3 className="text-xl font-bold text-white">{event.session}</h3>
            <p className="text-white/80 mt-2">Day: {event.day}</p>
            <p className="text-white/80 mt-2">Time: {event.time}</p>
            {event.details && <p className="text-white/80 mt-2">Details: {event.details}</p>}
          </div>
        ))}
      </div>
    </div>
  );
} 