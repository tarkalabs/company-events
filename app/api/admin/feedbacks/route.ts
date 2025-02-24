import { NextResponse } from 'next/server';
import { db } from '@/lib/firebase/config';
import { collection, getDocs } from 'firebase/firestore';

export async function GET() {
    try {
        console.log('[API] Fetching all feedbacks');
        const feedbacksRef = collection(db, 'feedbacks');
        const snapshot = await getDocs(feedbacksRef);
        
        const feedbacks = snapshot.docs.map(doc => {
            const data = doc.data();
            return {
                id: doc.id,
                eventId: data.eventId,
                userId: data.userId,
                rating: data.rating,
                comments: data.comments,
                createdAt: data.updatedAt?.toDate?.().toISOString() || null
            };
        });

        console.log('[API] Retrieved feedbacks:', feedbacks);
        return NextResponse.json(feedbacks);
    } catch (error) {
        console.error('[API] Error fetching feedbacks:', error);
        return NextResponse.json(
            { error: 'Failed to fetch feedbacks' },
            { status: 500 }
        );
    }
} 