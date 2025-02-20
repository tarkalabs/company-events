'use client';

import { useEffect, useState } from 'react';

interface Feedback {
    id: string;
    eventId: string;
    userId: string;
    rating: number;
    comments: string;
    event: {
        session: string;
    };
    user: {
        username: string;
    };
}

export default function DatabasePage() {
    const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Fetch database feedbacks
        async function fetchFeedbacks() {
            try {
                const response = await fetch('/api/feedback');
                if (!response.ok) {
                    throw new Error('Failed to fetch feedbacks');
                }
                const data = await response.json();
                setFeedbacks(data);
            } catch (error) {
                console.error('Error fetching feedbacks:', error);
            } finally {
                setLoading(false);
            }
        }

        fetchFeedbacks();
    }, []);

    const handleExport = () => {
        const jsonString = JSON.stringify(feedbacks, null, 2);
        const blob = new Blob([jsonString], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = 'feedbacks.json';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    };

    if (loading) {
        return <div className="container mx-auto px-4 py-8 text-black">Loading...</div>;
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="mb-6">
                <button
                    onClick={handleExport}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                    Export Feedbacks
                </button>
            </div>
            <div className="space-y-4">
                {feedbacks.map((feedback) => (
                    <div key={feedback.id} className="bg-white p-4 rounded-lg shadow">
                        <div className="grid grid-cols-2 gap-4 text-black">
                            <div>
                                <h3 className="font-semibold">Feedback ID</h3>
                                <p className="text-gray-700">{feedback.id}</p>
                            </div>
                            <div>
                                <h3 className="font-semibold">Event</h3>
                                <p className="text-gray-700">{feedback.event.session}</p>
                            </div>
                            <div>
                                <h3 className="font-semibold">User</h3>
                                <p className="text-gray-700">{feedback.user.username}</p>
                            </div>
                            <div>
                                <h3 className="font-semibold">Rating</h3>
                                <p className="text-gray-700">{feedback.rating}</p>
                            </div>
                            <div className="col-span-2">
                                <h3 className="font-semibold">Comments</h3>
                                <p className="text-gray-700">{feedback.comments}</p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
} 