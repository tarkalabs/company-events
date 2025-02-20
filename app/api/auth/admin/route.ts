import { NextResponse } from 'next/server';

const FALLBACK_ADMIN_PASSWORD = "0;?BYA5MIEKFo<~p";

export async function POST(request: Request) {
    try {
        const { username, password } = await request.json();

        if (!username || !password) {
            return NextResponse.json(
                { error: 'Username and password are required' },
                { status: 400 }
            );
        }

        // Check against environment variable with fallback
        const adminPassword = process.env.ADMIN_PASSWORD || FALLBACK_ADMIN_PASSWORD;
        if (password !== adminPassword) {
            return NextResponse.json(
                { error: 'Invalid credentials' },
                { status: 401 }
            );
        }

        return NextResponse.json({
            success: true
        });
    } catch (error) {
        console.error('Admin auth error:', error);
        return NextResponse.json(
            { error: 'Authentication failed' },
            { status: 500 }
        );
    }
} 