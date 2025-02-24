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

interface User {
    id: string;
    username: string;
    businessUnit: string;
}

// User-related functions
export async function getUser(username: string): Promise<User | null> {
    try {
        const usersRef = collection(db, 'users');
        const q = query(usersRef, where('username', '==', username));
        const querySnapshot = await getDocs(q);

        if (querySnapshot.empty) return null;

        const userDoc = querySnapshot.docs[0];
        return {
            id: userDoc.id,
            username: userDoc.data().username,
            businessUnit: userDoc.data().businessUnit
        };
    } catch (error) {
        console.error('Error getting user:', error);
        throw error;
    }
}

export async function createUser(username: string, businessUnit: string): Promise<User> {
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

export async function getOrCreateUser(username: string, businessUnit: string): Promise<User> {
    try {
        let user = await getUser(username);
        if (!user) {
            user = await createUser(username, businessUnit);
        }
        return user;
    } catch (error) {
        console.error('Error in getOrCreateUser:', error);
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
    try {
        const eventsRef = collection(db, 'events');
        const defaultEvents = [
            {
                title: 'Company Annual Meeting',
                date: new Date(new Date().getFullYear(), 11, 25), // December 25th
                description: 'Annual company-wide meeting and year-end celebration',
                location: 'Main Conference Hall'
            },
            {
                title: 'Summer Team Building',
                date: new Date(new Date().getFullYear(), 6, 15), // July 15th
                description: 'Team building activities and outdoor events',
                location: 'City Park'
            }
        ];

        await Promise.all(defaultEvents.map(event => addDoc(eventsRef, {
            ...event,
            createdAt: new Date()
        })));

        return true;
    } catch (error) {
        console.error('Error initializing default events:', error);
        throw error;
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
        // Get user details first
        const userRef = doc(db, 'users', feedback.userId);
        const userDoc = await getDoc(userRef);
        const userData = userDoc.data();

        const feedbackRef = doc(db, 'feedbacks', `${feedback.eventId}-${feedback.userId}`);
        await setDoc(feedbackRef, {
            ...feedback,
            // Store user details directly in feedback
            userDetails: {
                username: userData?.username || 'Unknown User',
                businessUnit: userData?.businessUnit || 'Unknown BU'
            },
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
            eventsSnapshot.docs.map(doc => {
                const data = doc.data();
                return [
                    doc.id,
                    {
                        id: doc.id,
                        day: data.day,
                        time: data.time,
                        session: data.session || data.Session || 'Unknown Session', // Handle both casings
                        details: data.details
                    }
                ];
            })
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
                    username: data.userDetails?.username || data.userId,
                    businessUnit: data.userDetails?.businessUnit || 'Unknown BU'
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

export async function getAllFeedbacksWithUserDetails() {
    try {
        console.log('[db] Fetching all feedbacks with user details');
        const feedbacksRef = collection(db, 'feedbacks');
        const snapshot = await getDocs(feedbacksRef);

        // Get all events in parallel (we don't need users anymore)
        const eventsSnapshot = await getDocs(collection(db, 'events'));

        const eventsMap = new Map(
            eventsSnapshot.docs.map(doc => {
                const data = doc.data();
                return [
                    doc.id,
                    {
                        id: doc.id,
                        day: data.day || 0,
                        time: data.time || '',
                        session: data.session || data.Session || 'Unknown Session', // Handle both casings
                        details: data.details || ''
                    }
                ];
            })
        );

        const feedbacks = snapshot.docs.map(doc => {
            const data = doc.data();
            const event = eventsMap.get(data.eventId);

            return {
                id: doc.id,
                eventId: data.eventId,
                userId: data.userId,
                rating: data.rating,
                comments: data.comments,
                createdAt: data.createdAt?.toDate?.() || null,
                event: {
                    id: event?.id || '',
                    session: event?.session || 'Unknown Session',
                    day: event?.day || 0,
                    time: event?.time || ''
                },
                user: {
                    username: data.userDetails?.username || 'Unknown User',
                    businessUnit: data.userDetails?.businessUnit || 'Unknown BU'
                }
            };
        });

        console.log('[db] Processed feedbacks:', feedbacks);
        return feedbacks;
    } catch (error) {
        console.error('Error getting feedbacks with user details:', error);
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

// Admin functions
export async function verifyAdmin(username: string, password: string) {
    try {
        if (username === process.env.ADMIN_USERNAME &&
            password === process.env.ADMIN_PASSWORD) {
            return {
                id: 'admin',
                username: username
            };
        }
        return null;
    } catch (error) {
        console.error('Error verifying admin:', error);
        throw error;
    }
}