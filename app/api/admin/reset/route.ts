import { NextResponse } from 'next/server';
import { db } from '@/lib/firebase/config';
import { collection, getDocs, deleteDoc } from 'firebase/firestore';
import { initializeDefaultEvents } from '@/lib/db';

export async function POST() {
    try {
        // Clear existing events
        const eventsRef = collection(db, 'events');
        const snapshot = await getDocs(eventsRef);
        await Promise.all(snapshot.docs.map(doc => deleteDoc(doc.ref)));

        // Initialize new events
        await initializeDefaultEvents();

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Error resetting events:', error);
        return NextResponse.json({ error: 'Failed to reset events' }, { status: 500 });
    }
} 