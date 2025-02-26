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
                "day": 1,
                "time": "09:30 AM",
                "session": "Ice breaker + Welcome Note + Sneak peek and House Rules",
                "details": null
            },
            {
                "day": 1,
                "time": "10:00 AM",
                "session": "CFO's Sedin Vision - Setting the Pace for 2025",
                "details": "Mani will present the Vision for 2025, plus Q&A"
            },
            {
                "day": 1,
                "time": "10:15 AM",
                "session": "Hearing from our Core Operations",
                "details": "IT, Finance, Admin, and Marketing will present recap and challenges needing attention"
            },
            {
                "day": 1,
                "time": "11:00 AM",
                "session": "Coffee + Networking",
                "details": null
            },
            {
                "day": 1,
                "time": "11:15 AM",
                "session": "The New Sedin - An Operational Vision",
                "details": "A presentation detailing the changes to come as we transform into a unified org"
            },
            {
                "day": 1,
                "time": "12:00 PM",
                "session": "Future of AI for Small Orgs",
                "details": "Industry veteran Dr. Rajeswaran's speech about the Future of AI for small orgs"
            },
            {
                "day": 1,
                "time": "1:00 PM",
                "session": "Lunch",
                "details": null
            },
            {
                "day": 1,
                "time": "2:00 PM",
                "session": "Quiz - General Knowledge Trivia",
                "details": "A fun trivia session"
            },
            {
                "day": 1,
                "time": "2:15 PM",
                "session": "Panel Discussion - Performance at Sedin",
                "details": "A discussion on the existing performance setup, and what must change"
            },
            {
                "day": 1,
                "time": "3:15 PM",
                "session": "BU Presentations *2",
                "details": "Presentations from BU heads on the year gone by and plans for the next year"
            },
            {
                "day": 1,
                "time": "4:15 PM",
                "session": "Coffee",
                "details": null
            },
            {
                "day": 1,
                "time": "4:30 PM",
                "session": "BU Presentations *2",
                "details": "Presentations from BU heads on the year gone by and plans for the next year"
            },
            {
                "day": 1,
                "time": "5:30 PM",
                "session": "Break",
                "details": null
            },
            {
                "day": 1,
                "time": "5:40 PM",
                "session": "AI We Should Do - A Tech Vision Exercise",
                "details": "Part 1: Our learning journey, AI chapter, and initiatives so far. Part 2: Looking ahead on how we will be accountable for AI at Sedin"
            },
            {
                "day": 1,
                "time": "6:30 PM",
                "session": "Closing Note",
                "details": null
            },
            {
                "day": 2,
                "time": "09:30 AM",
                "session": "BU Presentations *4",
                "details": "Presentations from BU heads on the year gone by and plans for the next year"
            },
            {
                "day": 2,
                "time": "11:30 AM",
                "session": "Coffee",
                "details": null
            },
            {
                "day": 2,
                "time": "11:45 AM",
                "session": "DS, DC and ES - The 'New' Sedin - How Do We Co-operate",
                "details": "How can we all collaborate to make the vision a success"
            },
            {
                "day": 2,
                "time": "12:45 PM",
                "session": "Lunch",
                "details": null
            },
            {
                "day": 2,
                "time": "1:45 PM",
                "session": "Fun Activity",
                "details": "Another fun trivia session"
            },
            {
                "day": 2,
                "time": "2:00 PM",
                "session": "Global Office Updates - Steve and Hari",
                "details": "Middle East and Australia will present a recap and plans for their region"
            },
            {
                "day": 2,
                "time": "3:00 PM",
                "session": "Panel: Our Collaboration Approach to Move Forward Smoothly",
                "details": "A discussion on our rapport and communication, and what we can do better"
            },
            {
                "day": 2,
                "time": "3:45 PM",
                "session": "Coffee + Networking",
                "details": null
            },
            {
                "day": 2,
                "time": "4:15 PM",
                "session": "Sedin @ 100 Mn - A Futurespective",
                "details": "A future thinking exercise to hit our targets, intentions and what will propel us forward"
            },
            {
                "day": 2,
                "time": "5:00 PM",
                "session": "GTM/Sales Update",
                "details": "A recap of the previous year by the sales teams, and their upcoming plans"
            },
            {
                "day": 2,
                "time": "6:00 PM",
                "session": "Closing Note",
                "details": null
            },
            {
                "day": 2,
                "time": "6:15 PM",
                "session": "Dinner",
                "details": null
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