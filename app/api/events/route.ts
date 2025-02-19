import { getEvents } from '@/lib/db';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const events = await getEvents();
    return NextResponse.json(events || []);
  } catch (error) {
    console.error('Error fetching events:', error);
    return NextResponse.json({ error: 'Failed to fetch events' }, { status: 500 });
  }
} 