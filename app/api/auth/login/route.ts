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

        return NextResponse.json({
            success: true,
            user: userResponse
        });
    } catch (error) {
        console.error('Login error:', error);
        return NextResponse.json({ error: 'Login failed' }, { status: 500 });
    }
}
//adding comment