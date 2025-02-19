'use client';

import { useEffect, useState } from 'react';

interface Feedback {
  id: string;
  event: {
    Session: string;
  };
  user: {
    username: string;
  };
  rating: number;
  comments: string;
}

export default function FeedbackList() {
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchFeedbacks() {
      try {
        const response = await fetch('/api/feedback');
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

  if (loading) {
    return <div className="p-6 text-white">Loading...</div>;
  }

  return (
    <div className="p-6">
      <h2 className="text-3xl font-bold text-white mb-6">All Feedbacks</h2>
      <div className="space-y-4">
        {feedbacks.map((feedback) => (
          <div key={feedback.id} className="bg-white/10 backdrop-blur-lg border border-white/20 p-6 rounded-xl shadow-lg">
            <h3 className="text-xl font-bold text-white">{feedback.event.Session}</h3>
            <p className="text-white/80 mt-2">User: {feedback.user.username}</p>
            <p className="text-white/80 mt-2">Rating: {feedback.rating}</p>
            <p className="text-white/80 mt-2">Comments: {feedback.comments}</p>
          </div>
        ))}
      </div>
    </div>
  );
} 