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
function timeToMinutes(timeStr: string): number {
    // Standardize the time format first
    const upperTime = timeStr.toUpperCase().trim();
    const [time, period] = upperTime.split(' ');
    let [hours, minutes] = time.split(':').map(Number);
    
    // Convert to 24-hour format
    if (period === 'PM' && hours !== 12) {
        hours += 12;
    } else if (period === 'AM' && hours === 12) {
        hours = 0;
    }
    
    return hours * 60 + minutes;
}

export async function getEvents(): Promise<Event[]> {
    try {
        const eventsRef = collection(db, 'events');
        const snapshot = await getDocs(eventsRef);

        let events: Event[] = [];

        if (snapshot.empty) {
            await initializeDefaultEvents();
            const newSnapshot = await getDocs(eventsRef);
            events = newSnapshot.docs.map(docToEvent);
        } else {
            events = snapshot.docs.map(docToEvent);
        }

        // Sort events by day and time
        return events.sort((a, b) => {
            if (a.day !== b.day) {
                return a.day - b.day;
            }
            return timeToMinutes(a.time) - timeToMinutes(b.time);
        });
    } catch (error) {
        console.error('Error getting events:', error);
        throw error;
    }
}

function docToEvent(doc: any): Event {
    const data = doc.data();
    return {
        id: doc.id,
        day: data.day,
        time: data.time,
        session: data.session,
        details: data.details
    };
}

// Add this function after the getEvents function
export async function initializeDefaultEvents() {
    const events = [
        {
            day: 1,
            time: "9:30 AM",
            session: "Ice breaker & Welcome Note",
            details: null
        },
        {
            day: 1,
            time: "9:45 AM",
            session: "Sneak peek into the next two days",
            details: "Agenda + ground rules"
        },
        {
            day: 1,
            time: "10:00 AM",
            session: "CFO's Sedin Vision - Setting the Pace for 2025",
            details: "Mani will present the Vision for 2025, plus Q&A"
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
        },
        {
            day: 2,
            time: "6:15 PM",
            session: "Dinner",
            details: null
        }
    ];

    const eventsRef = collection(db, 'events');

    for (const event of events) {
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
        console.log('[db] Fetching all feedbacks');
        const feedbacksRef = collection(db, 'feedbacks');
        const snapshot = await getDocs(feedbacksRef);
        console.log('[db] Raw feedback docs:', snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));

        // Get all events first
        const eventsRef = collection(db, 'events');
        const eventsSnapshot = await getDocs(eventsRef);
        const eventsMap = new Map<string, Event>(
            eventsSnapshot.docs.map(doc => [
                doc.id,
                {
                    id: doc.id,
                    day: doc.data().day,
                    time: doc.data().time,
                    session: doc.data().session,
                    details: doc.data().details
                }
            ])
        );
        console.log('[db] Events map:', Object.fromEntries(eventsMap));

        const feedbacks = snapshot.docs.map(doc => {
            const data = doc.data();
            const event = eventsMap.get(data.eventId);

            return {
                id: doc.id,
                eventId: data.eventId,
                userId: data.userId,
                rating: data.rating,
                comments: data.comments,
                createdAt: data.updatedAt?.toDate?.() || null,
                event: {
                    session: event?.session || 'Unknown Session'
                },
                user: {
                    username: data.userId
                }
            };
        });

        console.log('[db] Processed feedbacks:', feedbacks);
        return feedbacks;
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