import {
    collection,
    doc,
    getDocs,
    getDoc,
    query,
    where,
    addDoc,
    orderBy,
    setDoc
} from 'firebase/firestore';
import { db } from './firebase/config';
import { Event, Feedback } from '@/app/types';

// User-related functions
export async function getUser(username: string) {
    try {
        const usersRef = collection(db, 'users');
        const q = query(usersRef, where('username', '==', username));
        const querySnapshot = await getDocs(q);

        if (querySnapshot.empty) return null;

        const userDoc = querySnapshot.docs[0];
        return {
            id: userDoc.id,
            ...userDoc.data()
        };
    } catch (error) {
        console.error('Error getting user:', error);
        throw error;
    }
}

export async function createUser(username: string, businessUnit: string) {
    try {
        const usersRef = collection(db, 'users');
        const userDoc = await addDoc(usersRef, {
            username,
            businessUnit,
            createdAt: new Date()
        });

        return {
            id: userDoc.id,
            username,
            businessUnit
        };
    } catch (error) {
        console.error('Error creating user:', error);
        throw error;
    }
}

// Event-related functions
export async function getEvents(): Promise<Event[]> {
    try {
        const eventsRef = collection(db, 'events');
        const snapshot = await getDocs(eventsRef);

        if (snapshot.empty) {
            await initializeDefaultEvents();
            const newSnapshot = await getDocs(eventsRef);
            return newSnapshot.docs.map(doc => {
                const data = doc.data();
                return {
                    id: doc.id,
                    day: data.day,
                    time: data.time,
                    session: data.session,
                    details: data.details
                };
            });
        }

        return snapshot.docs.map(doc => {
            const data = doc.data();
            return {
                id: doc.id,
                day: data.day,
                time: data.time,
                session: data.session,
                details: data.details
            };
        });
    } catch (error) {
        console.error('Error getting events:', error);
        throw error;
    }
}

// Add this function after the getEvents function
async function initializeDefaultEvents() {
    const defaultEvents = [
        {
            day: 1,
            time: "09:00 AM",
            session: "Opening Keynote",
            details: "Welcome address and company vision for 2024"
        },
        {
            day: 1,
            time: "11:00 AM",
            session: "Technical Workshop",
            details: "Hands-on session with new technologies"
        },
        {
            day: 1,
            time: "02:00 PM",
            session: "Team Building",
            details: "Interactive team building activities"
        },
        {
            day: 2,
            time: "09:30 AM",
            session: "Product Roadmap",
            details: "Upcoming features and product strategy"
        },
        {
            day: 2,
            time: "11:30 AM",
            session: "Innovation Lab",
            details: "Exploring emerging technologies"
        },
        {
            day: 2,
            time: "02:30 PM",
            session: "Closing Session",
            details: "Wrap up and future plans"
        }
    ];

    const eventsRef = collection(db, 'events');

    for (const event of defaultEvents) {
        await addDoc(eventsRef, event);
    }
}

// Feedback-related functions
export async function getEventFeedback(eventId: string, userId: string) {
    try {
        const feedbackRef = doc(db, 'feedbacks', `${eventId}-${userId}`);
        const feedbackDoc = await getDoc(feedbackRef);

        if (!feedbackDoc.exists()) return null;

        return {
            id: feedbackDoc.id,
            ...feedbackDoc.data()
        };
    } catch (error) {
        console.error('Error getting feedback:', error);
        throw error;
    }
}

export async function submitFeedback(feedback: {
    eventId: string;
    userId: string;
    rating: number;
    comments: string;
}) {
    try {
        const feedbackRef = doc(db, 'feedbacks', `${feedback.eventId}-${feedback.userId}`);
        await setDoc(feedbackRef, {
            ...feedback,
            updatedAt: new Date()
        });

        return {
            id: feedbackRef.id,
            ...feedback
        };
    } catch (error) {
        console.error('Error submitting feedback:', error);
        throw error;
    }
}

export async function getAllFeedbacks() {
    try {
        const feedbacksRef = collection(db, 'feedbacks');
        const querySnapshot = await getDocs(feedbacksRef);

        return querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));
    } catch (error) {
        console.error('Error getting all feedbacks:', error);
        throw error;
    }
}

export async function checkDatabaseState() {
    try {
        const collections = ['users', 'events', 'feedbacks'];
        const state: Record<string, number> = {};

        for (const collectionName of collections) {
            const querySnapshot = await getDocs(collection(db, collectionName));
            state[collectionName] = querySnapshot.size;
        }

        return state;
    } catch (error) {
        console.error('Error checking database state:', error);
        throw error;
    }
}