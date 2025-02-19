import { createUser, getUser } from '@/lib/db';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { username, businessUnit } = await request.json();

    if (!username || !businessUnit) {
      return NextResponse.json(
        { error: 'Username and business unit are required' },
        { status: 400 }
      );
    }

    console.log('Attempting to authenticate:', { username, businessUnit });

    let user = await getUser(username);
    console.log('Existing user:', user);

    if (!user) {
      console.log('Creating new user...');
      user = await createUser(username, businessUnit);
      console.log('New user created:', user);
    }

    if (!user) {
      return NextResponse.json(
        { error: 'Failed to create or retrieve user' },
        { status: 500 }
      );
    }

    console.log('Sending user response:', user);
    return NextResponse.json({
      id: user.id,
      username: user.username,
      businessUnit: user.businessUnit
    });
  } catch (error) {
    console.error('Auth error:', error);
    return NextResponse.json(
      { error: 'Failed to create user' },
      { status: 500 }
    );
  }
} 