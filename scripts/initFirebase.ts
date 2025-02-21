import { config } from 'dotenv';
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, addDoc, getDocs, deleteDoc } from 'firebase/firestore';

// Load environment variables from .env.local
config({ path: '.env.local' });

const firebaseConfig = {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID
};

// Validate config
if (!firebaseConfig.apiKey || !firebaseConfig.projectId) {
    console.error('Missing required Firebase configuration. Check your .env.local file.');
    process.exit(1);
}

console.log('Firebase config:', {
    hasApiKey: !!firebaseConfig.apiKey,
    hasProjectId: !!firebaseConfig.projectId,
    projectId: firebaseConfig.projectId
});

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function clearExistingEvents() {
    console.log('Clearing existing events...');
    const eventsRef = collection(db, 'events');
    const snapshot = await getDocs(eventsRef);
    const deletePromises = snapshot.docs.map(doc => deleteDoc(doc.ref));
    await Promise.all(deletePromises);
    console.log('Cleared existing events');
}

async function initializeEvents() {
    try {
        await clearExistingEvents();
        
        const events = [
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
        console.log('Adding new events...');
        
        for (const event of events) {
            const docRef = await addDoc(eventsRef, event);
            console.log('Added event:', { id: docRef.id, ...event });
        }
        
        console.log('Events initialized successfully');
    } catch (error) {
        console.error('Error during initialization:', error);
        if (error instanceof Error) {
            console.error('Error details:', {
                message: error.message,
                stack: error.stack
            });
        }
        process.exit(1);
    }
}

// Run initialization
initializeEvents()
    .then(() => {
        console.log('Initialization complete');
        process.exit(0);
    })
    .catch((error) => {
        console.error('Initialization failed:', error);
        process.exit(1);
    });