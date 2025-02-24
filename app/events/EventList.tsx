'use client';

import { useState, useEffect, useMemo } from 'react';
import type { Event } from '@/app/types';
import React from 'react';

function StarRating({ rating, onRate }: { rating: number; onRate: (r: number) => void }) {
  return (
    <div className="flex gap-2">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          onClick={() => onRate(star)}
          className="p-1 focus:outline-none touch-manipulation"
        >
          <svg
            className={`w-6 h-6 sm:w-5 sm:h-5 ${rating >= star ? 'text-yellow-400' : 'text-gray-300'}`}
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        </button>
      ))}
    </div>
  );
}

// Memoize the EventCard component to prevent unnecessary re-renders
const EventCard = React.memo(({ event, feedback, isEditing, onSubmit, onEdit }: {
  event: Event;
  feedback: { rating: number; comments: string } | undefined;
  isEditing: boolean;
  onSubmit: (rating: number, comments: string) => void;
  onEdit: () => void;
}) => {
  const [tempRating, setTempRating] = useState(feedback?.rating || 0);
  const [tempComments, setTempComments] = useState(feedback?.comments || '');

  return (
    <div className="bg-white/10 backdrop-blur-lg border border-white/20 p-4 sm:p-6 rounded-xl shadow-lg transform-gpu">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2 sm:gap-4 mb-4">
        <div className="flex-1">
          <div className="flex items-start justify-between">
            <h3 className="text-lg sm:text-xl font-bold text-white pr-2">{event.session}</h3>
            <span className="px-2 py-1 bg-blue-600/30 text-white rounded-full text-sm whitespace-nowrap">
              {event.time}
            </span>
          </div>
          {event.details && (
            <p className="text-white/80 mt-2 text-sm sm:text-base">{event.details}</p>
          )}
        </div>
      </div>

      <div className="mt-4">
        {isEditing ? (
          <div className="space-y-4">
            <div className="flex justify-center sm:justify-start">
              <StarRating rating={tempRating} onRate={setTempRating} />
            </div>
            <textarea
              value={tempComments}
              onChange={(e) => setTempComments(e.target.value)}
              className="w-full p-2 rounded bg-white/10 text-white min-h-[100px] text-sm sm:text-base"
              placeholder="Add your comments (optional)..."
            />
            <div className="flex flex-col sm:flex-row gap-2">
              <button
                onClick={() => onSubmit(tempRating, tempComments)}
                disabled={tempRating === 0}
                className={`w-full sm:w-auto px-4 py-2 text-white rounded-lg transition-colors ${tempRating === 0
                    ? 'bg-blue-600/50 cursor-not-allowed'
                    : 'bg-blue-600 hover:bg-blue-700'
                  }`}
              >
                Save
              </button>
              <button
                onClick={() => onEdit()}
                className="w-full sm:w-auto px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <div>
            {feedback ? (
              <div className="space-y-2">
                <div className="flex justify-center sm:justify-start">
                  <StarRating rating={feedback.rating} onRate={() => onEdit()} />
                </div>
                <p className="text-white/80 text-sm sm:text-base">{feedback.comments}</p>
                <button
                  onClick={() => onEdit()}
                  className="text-blue-400 text-sm hover:text-blue-300 transition-colors"
                >
                  Edit Feedback
                </button>
              </div>
            ) : (
              <button
                onClick={() => onEdit()}
                className="w-full sm:w-auto px-4 py-2 bg-blue-600/20 text-blue-400 rounded-lg hover:bg-blue-600/30 transition-colors text-sm sm:text-base"
              >
                Add Feedback
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
});

EventCard.displayName = 'EventCard';

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

export default function EventList() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [feedbacks, setFeedbacks] = useState<Record<string, { rating: number; comments: string }>>({});
  const [editingEvent, setEditingEvent] = useState<string | null>(null);
  const [selectedDay, setSelectedDay] = useState<number | null>(null);

  // Memoize the filtered events
  const filteredEvents = selectedDay
    ? events.filter(event => event.day === selectedDay)
    : events;

  const uniqueDays = [...new Set(events.map(event => event.day))].sort((a, b) => a - b);

  const handleSubmitFeedback = async (eventId: string, rating: number, comments: string) => {
    try {
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      if (!user.id) {
        console.error('No user found in localStorage');
        return;
      }

      console.log('[EventList] Submitting feedback:', { 
        eventId, 
        rating, 
        comments, 
        userId: user.id 
      });

      const response = await fetch(`/api/feedback/${eventId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-User-Id': user.id
        },
        body: JSON.stringify({
          rating,
          comments
        })
      });

      const newFeedback = await response.json();
      console.log('[EventList] Feedback submission response:', newFeedback);

      // Update local state with new feedback
      setFeedbacks(prev => ({
        ...prev,
        [eventId]: {
          rating: newFeedback.rating,
          comments: newFeedback.comments
        }
      }));

      // Clear editing state
      setEditingEvent(null);
    } catch (error) {
      console.error('Error submitting feedback:', error);
    }
  };

  useEffect(() => {
    let mounted = true;

    async function fetchEvents() {
        try {
            console.log('Fetching events...');
            const response = await fetch('/api/events');
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const data = await response.json();
            console.log('Received events:', data);

            if (!mounted) return;

            if (!Array.isArray(data)) {
                console.error('Received invalid data format:', data);
                setLoading(false);
                return;
            }

            const eventsWithIds = data.map((event: Event) => ({
                ...event,
                id: event.id || `${event.day}-${event.time}`
            }));
            
            setEvents(eventsWithIds);
            setLoading(false);

            // Fetch feedback for each event
            const user = JSON.parse(localStorage.getItem('user') || '{}');
            if (!user.id) {
                console.error('No user found in localStorage');
                return;
            }

            const feedbackPromises = eventsWithIds.map(async (event: Event) => {
                try {
                    const response = await fetch(`/api/feedback/${event.id}`, {
                        headers: {
                            'X-User-Id': user.id
                        }
                    });
                    if (!response.ok) return null;
                    return response.json();
                } catch (error) {
                    console.error(`Error fetching feedback for event ${event.id}:`, error);
                    return null;
                }
            });

            if (!mounted) return;

            const feedbackResults = await Promise.all(feedbackPromises);
            const newFeedbacks = feedbackResults.reduce((acc, feedback, index) => {
                if (feedback) {
                    acc[eventsWithIds[index].id!] = {
                        rating: feedback.rating,
                        comments: feedback.comments
                    };
                }
                return acc;
            }, {});

            setFeedbacks(newFeedbacks);
        } catch (error) {
            console.error('Error fetching events:', error);
        } finally {
            if (mounted) {
                setLoading(false);
            }
        }
    }

    fetchEvents();

    return () => {
        mounted = false;
    };
}, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-white text-lg">
          <div className="animate-pulse">Loading...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-4 sm:p-6 max-w-4xl mx-auto">
      <div className="flex gap-2">
        {uniqueDays.map(day => (
          <button
            key={day}
            onClick={() => setSelectedDay(selectedDay === day ? null : day)}
            className={`px-4 py-2 rounded-lg transition-colors ${
              selectedDay === day
                ? 'bg-blue-600 text-white'
                : 'bg-white/10 text-white hover:bg-white/20'
            }`}
          >
            Day {day}
          </button>
        ))}
      </div>

      <div className="space-y-4">
        {filteredEvents.map((event) => (
          <EventCard
            key={event.id}
            event={event}
            feedback={feedbacks[event.id!]}
            isEditing={editingEvent === event.id}
            onSubmit={(rating, comments) => handleSubmitFeedback(event.id!, rating, comments)}
            onEdit={() => setEditingEvent(editingEvent === event.id ? null : (event.id || null))}
          />
        ))}
      </div>
    </div>
  );
} 