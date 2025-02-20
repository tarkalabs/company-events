import { checkDatabaseState } from '@/lib/db';
import { NextResponse } from 'next/server';

export async function GET() {
    try {
        const state = await checkDatabaseState();
        return NextResponse.json(state);
    } catch (_error) {
        return NextResponse.json(
            { error: _error },
            { status: 500 }
        );
    }
} 