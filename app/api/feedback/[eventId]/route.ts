import { getEventFeedback, submitFeedback } from '@/lib/db';
import { NextResponse } from 'next/server';

export async function GET(
    request: Request,
    { params }: { params: { eventId: string } }
) {
    try {
        const userId = request.headers.get('X-User-Id');
        if (!userId) {
            return NextResponse.json({ error: 'User ID required' }, { status: 400 });
        }

        const feedback = await getEventFeedback(params.eventId, userId);
        return NextResponse.json(feedback);
    } catch (error) {
        return NextResponse.json(
            { error: error instanceof Error ? error.message : 'An error occurred' },
            { status: 500 }
        );
    }
}

export async function POST(
    request: Request,
    { params }: { params: { eventId: string } }
) {
    try {
        const { eventId } = params;
        const { rating, comments } = await request.json();
        const userId = request.headers.get('X-User-Id');

        if (!userId) {
            return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
        }

        const feedback = await submitFeedback({
            eventId,
            userId,
            rating,
            comments
        });

        return NextResponse.json({ 
            success: true, 
            rating: feedback.rating, 
            comments: feedback.comments 
        });
    } catch (error) {
        console.error('Error saving feedback:', error);
        return NextResponse.json(
            { error: 'Failed to save feedback' },
            { status: 500 }
        );
    }
}
