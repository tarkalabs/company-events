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
        const userId = request.headers.get('X-User-Id');
        if (!userId) {
            return NextResponse.json({ error: 'User ID required' }, { status: 400 });
        }

        const { rating, comments } = await request.json();

        if (typeof rating !== 'number' || rating <= 0) {
            return NextResponse.json(
                { error: 'Rating is required and must be greater than 0' },
                { status: 400 }
            );
        }

        const feedback = await submitFeedback({
            eventId: params.eventId,
            userId,
            rating,
            comments: comments || '',
        });

        return NextResponse.json(feedback);
    } catch (error) {
        return NextResponse.json(
            { error: error instanceof Error ? error.message : 'An error occurred' },
            { status: 500 }
        );
    }
}
