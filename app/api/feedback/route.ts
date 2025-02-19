import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { Feedback } from '@/app/types';
import { getAllFeedbacks } from '@/lib/db';

export async function POST(request: NextRequest) {
    try {
        const feedback: Feedback = await request.json();

        // TODO: Add your database logic here
        // For now, just return the feedback
        return NextResponse.json(feedback);
    } catch (error) {
        return NextResponse.json(
            { error: 'Failed to submit feedback' },
            { status: 500 }
        );
    }
}

export async function GET() {
    try {
        const feedbacks = await getAllFeedbacks();
        return NextResponse.json(feedbacks);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch feedbacks' }, { status: 500 });
    }
} 