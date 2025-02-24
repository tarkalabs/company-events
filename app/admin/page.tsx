'use client';

import { useEffect, useState } from 'react';
import type { Event } from '@/app/types';
import { useRouter } from 'next/navigation';

interface Feedback {
    id: string;
    eventId: string;
    userId: string;
    rating: number;
    comments: string;
    createdAt: string | null;
}

// Add timeToMinutes function
function timeToMinutes(timeStr: string): number {
    const upperTime = timeStr.toUpperCase().trim();
    const [time, period] = upperTime.split(' ');
    let [hours, minutes] = time.split(':').map(Number);
    
    if (period === 'PM' && hours !== 12) {
        hours += 12;
    } else if (period === 'AM' && hours === 12) {
        hours = 0;
    }
    
    return hours * 60 + minutes;
}

export default function AdminPage() {
    const router = useRouter();
    const [events, setEvents] = useState<Event[]>([]);
    const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedEventId, setSelectedEventId] = useState<string | null>(null);

    useEffect(() => {
        async function fetchData() {
            try {
                const [eventsRes, feedbacksRes] = await Promise.all([
                    fetch('/api/admin/events'),
                    fetch('/api/admin/feedbacks')
                ]);

                if (!eventsRes.ok || !feedbacksRes.ok) {
                    throw new Error('Failed to fetch data');
                }

                const [eventsData, feedbacksData] = await Promise.all([
                    eventsRes.json(),
                    feedbacksRes.json()
                ]);

                // Sort events by day and time
                const sortedEvents = [...eventsData].sort((a, b) => {
                    if (a.day !== b.day) {
                        return a.day - b.day;
                    }
                    return timeToMinutes(a.time) - timeToMinutes(b.time);
                });

                setEvents(sortedEvents);
                setFeedbacks(feedbacksData);
            } catch (error) {
                console.error('Error fetching data:', error);
            } finally {
                setLoading(false);
            }
        }

        fetchData();
    }, []);

    const handleLogout = async () => {
        try {
            localStorage.removeItem('admin');
            await fetch('/api/auth/logout', { method: 'POST' });
            router.push('/login');
        } catch (error) {
            console.error('Error during logout:', error);
        }
    };

    const handleExport = () => {
        const exportData = events.map(event => ({
            event,
            feedbacks: feedbacks.filter(f => f.eventId === event.id),
            averageRating: getAverageRating(event.id!)
        }));

        const jsonString = JSON.stringify(exportData, null, 2);
        const blob = new Blob([jsonString], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = 'event-feedbacks.json';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    };

    const getAverageRating = (eventId: string) => {
        const eventFeedbacks = feedbacks.filter(f => f.eventId === eventId);
        if (eventFeedbacks.length === 0) return 0;
        const sum = eventFeedbacks.reduce((acc, curr) => acc + curr.rating, 0);
        return Number((sum / eventFeedbacks.length).toFixed(1));
    };

    if (loading) {
        return <div className="p-6 text-white">Loading...</div>;
    }

    return (
        <div className="p-6">
            <div className="flex justify-between items-center mb-8 bg-white/5 p-4 rounded-xl backdrop-blur-lg">
                <h1 className="text-2xl font-bold text-white">Admin Dashboard</h1>
                <div className="flex gap-4">
                    <button
                        onClick={handleExport}
                        className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
                        </svg>
                        Export All Feedbacks
                    </button>
                    <button
                        onClick={handleLogout}
                        className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center gap-2"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M3 3a1 1 0 00-1 1v12a1 1 0 102 0V4a1 1 0 00-1-1zm10.293 9.293a1 1 0 001.414 1.414l3-3a1 1 0 000-1.414l-3-3a1 1 0 10-1.414 1.414L14.586 9H7a1 1 0 100 2h7.586l-1.293 1.293z" clipRule="evenodd" />
                        </svg>
                        Logout
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {events.map((event) => (
                    <div
                        key={event.id}
                        onClick={() => setSelectedEventId(selectedEventId === event.id ? null : event.id)}
                        className={`
                            cursor-pointer
                            bg-white/10 backdrop-blur-lg
                            border border-white/20
                            p-6 rounded-xl shadow-lg
                            transition-all duration-200
                            ${selectedEventId === event.id ? 'ring-2 ring-blue-500' : 'hover:bg-white/20'}
                        `}
                    >
                        <h3 className="text-xl font-bold text-white">{event.session}</h3>
                        <p className="text-white/80 mt-2">Day: {event.day}</p>
                        <p className="text-white/80">Time: {event.time}</p>
                        <p className="text-white/80">Average Rating: {getAverageRating(event.id!)}</p>
                        
                        {selectedEventId === event.id && (
                            <div className="mt-4 space-y-4 border-t border-white/20 pt-4">
                                <h4 className="text-lg font-semibold text-white">Feedbacks</h4>
                                {feedbacks.filter(f => f.eventId === event.id).map((feedback) => (
                                    <div key={feedback.id} className="bg-black/20 rounded-lg p-4 space-y-2">
                                        <div className="flex justify-between items-center">
                                            <span className="text-white/80">Rating: {feedback.rating}/5</span>
                                            <span className="text-white/60 text-sm">
                                                {feedback.createdAt && new Date(feedback.createdAt).toLocaleDateString()}
                                            </span>
                                        </div>
                                        <p className="text-white/80">{feedback.comments}</p>
                                        <p className="text-white/60 text-sm">User: {feedback.userId}</p>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
} 