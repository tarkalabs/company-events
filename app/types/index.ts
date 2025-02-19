export interface User {
  username: string;
  businessUnit: string;
}

export interface Event {
  id?: string;
  Day: number;
  Time: string;
  Session: string;
  Details: string | null;
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