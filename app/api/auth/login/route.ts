import { NextResponse } from 'next/server';
import { getUser, createUser } from '@/lib/db';
import type { User } from '@/app/types';

export async function POST(request: Request) {
    try {
        const { username } = await request.json();
        let user = await getUser(username) as User | null;

        if (!user) {
            user = await createUser(username, 'default') as User;
        }

        if (!user) {
            throw new Error('Failed to create or retrieve user');
        }

        const userResponse = {
            id: user.id,
            username: user.username,
            businessUnit: user.businessUnit
        };

        // Set both cookies and return user data
        const response = NextResponse.json({
            success: true,
            user: userResponse
        });

        // Set auth cookie
        response.cookies.set('user', JSON.stringify(userResponse), {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: 60 * 60 * 24 * 7 // 1 week
        });

        return response;
    } catch (error) {
        console.error('Login error:', error);
        return NextResponse.json({ error: 'Login failed' }, { status: 500 });
    }
}