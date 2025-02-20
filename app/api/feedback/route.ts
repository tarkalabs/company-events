import { getAllFeedbacks } from '@/lib/db';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const feedbacks = await getAllFeedbacks();
    return NextResponse.json(feedbacks);
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'An error occurred' },
      { status: 500 }
    );
  }
} 