import { checkDatabaseState } from '@/lib/db';
import { NextResponse } from 'next/server';

export async function GET() {
    try {
        const state = await checkDatabaseState();
        return NextResponse.json(state);
    } catch (error) {
        return NextResponse.json(
            { error: 'Failed to check database state' },
            { status: 500 }
        );
    }
} 