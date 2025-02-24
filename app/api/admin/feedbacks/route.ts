import { NextResponse } from 'next/server';
import { getAllFeedbacksWithUserDetails } from '@/lib/db';
import { verifyAdminToken } from '@/lib/auth';

export async function GET(request: Request) {
    try {
        const authHeader = request.headers.get('Authorization');
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return NextResponse.json(
                { error: 'Unauthorized - Admin access required' },
                { status: 401 }
            );
        }

        const token = authHeader.split('Bearer ')[1];
        if (!token) {
            return NextResponse.json(
                { error: 'Invalid admin token' },
                { status: 401 }
            );
        }

        const isValid = await verifyAdminToken(token);
        if (!isValid) {
            return NextResponse.json(
                { error: 'Invalid or expired admin token' },
                { status: 401 }
            );
        }

        const feedbacks = await getAllFeedbacksWithUserDetails();
        return NextResponse.json(feedbacks);
    } catch (error) {
        console.error('Error fetching admin feedbacks:', error);
        return NextResponse.json(
            { error: 'Failed to fetch feedback data' },
            { status: 500 }
        );
    }
} 