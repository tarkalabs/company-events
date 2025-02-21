import { getEvents } from '@/lib/db';
import { NextResponse } from 'next/server';
import type { Event } from '@/app/types';

export async function GET() {
  try {
    const events = await getEvents();
    console.log('Events from db:', events);
    return NextResponse.json(events);
  } catch (error) {
    console.error('Error fetching events:', error);
    return NextResponse.json(
      { error: 'Failed to fetch events' }, 
      { status: 500 }
    );
  }
} 