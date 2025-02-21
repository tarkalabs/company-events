export interface User {
  id: string;
  username: string;
  businessUnit: string;
}

export interface Event {
  id: string;
  day: number;
  time: string;
  session: string;
  details?: string;
}

export interface EventFeedback {
  eventId: string;
  userId: string;
  rating: number;
  comments: string;
}

export interface Feedback {
  eventId: string;
  userId: string;
  rating: number;
  comments: string;
} 