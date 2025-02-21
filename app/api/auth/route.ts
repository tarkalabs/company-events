import { createUser, getUser } from '@/lib/db';
import { NextResponse } from 'next/server';
import type { User } from '@/app/types';

export async function POST(request: Request) {
  try {
    const { username } = await request.json();

    let user = await getUser(username) as User | null;

    if (!user) {
      user = await createUser(username, 'default') as User;
    }

    if (!user) {
      return NextResponse.json(
        { error: 'Failed to create or retrieve user' },
        { status: 500 }
      );
    }

    const userResponse: User = {
      id: user.id,
      username: user.username,
      businessUnit: user.businessUnit
    };

    const response = NextResponse.json({
      success: true,
      user: userResponse
    });

    // Set auth cookie
    response.cookies.set('auth', JSON.stringify(userResponse), {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7 // 1 week
    });

    return response;
  } catch (error) {
    console.error('Auth error:', error);
    return NextResponse.json(
      { error: 'Failed to create user' },
      { status: 500 }
    );
  }
} 