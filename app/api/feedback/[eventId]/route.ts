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
            { error: 'Failed to fetch feedback' },
            { status: 500 }
        );
    }
}

export async function POST(
    request: Request,
    { params }: { params: { eventId: string } }
) {
    try {
        const userId = request.headers.get('X-User-Id');
        if (!userId) {
            return NextResponse.json({ error: 'User ID required' }, { status: 400 });
        }

        const { rating, comments } = await request.json();

        if (typeof rating !== 'number' || !comments) {
            return NextResponse.json(
                { error: 'Rating and comments are required' },
                { status: 400 }
            );
        }

        console.log('Received feedback submission:', {
            eventId: params.eventId,
            userId,
            rating,
            comments
        });

        const feedback = await submitFeedback({
            eventId: params.eventId,
            userId,
            rating,
            comments,
        });

        return NextResponse.json(feedback);
    } catch (error) {
        console.error('Feedback submission error:', error);
        return NextResponse.json(
            { error: 'Failed to submit feedback' },
            { status: 500 }
        );
    }
} 