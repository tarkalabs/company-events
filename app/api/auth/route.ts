import { createUser, getUser } from '@/lib/db';
import { NextResponse } from 'next/server';
import type { User } from '@/app/types';

export async function POST(request: Request) {
  try {
    const { username, businessUnit } = await request.json();

    if (!username || !businessUnit) {
      return NextResponse.json({ 
        error: 'Username and business unit are required' 
      }, { status: 400 });
    }

    let user = await getUser(username) as User | null;

    if (!user) {
      user = await createUser(username, businessUnit) as User;
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
      { error: 'Failed to authenticate user' },
      { status: 500 }
    );
  }
} 