import React, { useState, useEffect } from 'react';
import StarRating from '../components/StarRating';
import type { Event } from '@/app/types';

const EventCard = React.memo(({ event, feedback, isEditing, onSubmit, onEdit }: {
  event: Event;
  feedback: { rating: number; comments: string } | undefined;
  isEditing: boolean;
  onSubmit: (rating: number, comments: string) => void;
  onEdit: () => void;
}) => {
  const [tempRating, setTempRating] = useState(feedback?.rating || 0);
  const [tempComments, setTempComments] = useState(feedback?.comments || '');

  useEffect(() => {
    if (feedback && !isEditing) {
      setTempRating(feedback.rating);
      setTempComments(feedback.comments);
    }
  }, [feedback, isEditing]);

  return (
    <div className="bg-white/10 backdrop-blur-lg border border-white/20 p-4 sm:p-6 rounded-xl shadow-lg transform-gpu">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2 sm:gap-4 mb-4">
        <div className="flex-1">
          <div className="flex items-start justify-between">
            <h3 className="text-lg sm:text-xl font-bold text-white">{event.session}</h3>
            <p className="text-white/60 text-sm">Day {event.day} - {event.time}</p>
            {event.details && (
              <p className="text-white/80 mt-2 text-sm sm:text-base">{event.details}</p>
            )}
          </div>
        </div>
      </div>

      {isEditing ? (
        <div className="space-y-4">
          <div className="flex justify-center sm:justify-start">
            <StarRating rating={tempRating} onRate={setTempRating} />
          </div>
          <textarea
            value={tempComments}
            onChange={(e) => setTempComments(e.target.value)}
            className="w-full bg-white/5 text-white border border-white/20 rounded-lg p-2"
            placeholder="Your feedback..."
            rows={3}
          />
          <div className="flex gap-2">
            <button
              onClick={() => onSubmit(tempRating, tempComments)}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Submit
            </button>
            <button
              onClick={onEdit}
              className="px-4 py-2 bg-white/10 text-white rounded-lg hover:bg-white/20"
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
                <StarRating rating={feedback.rating} readonly />
              </div>
              <p className="text-white/80 text-sm sm:text-base">{feedback.comments}</p>
              <button
                onClick={onEdit}
                className="text-blue-400 text-sm hover:text-blue-300 transition-colors"
              >
                Edit Feedback
              </button>
            </div>
          ) : (
            <button
              onClick={onEdit}
              className="w-full sm:w-auto px-4 py-2 bg-blue-600/20 text-blue-400 rounded-lg hover:bg-blue-600/30 transition-colors"
            >
              Add Feedback
            </button>
          )}
        </div>
      )}
    </div>
  );
});

EventCard.displayName = 'EventCard';

export default EventCard; 