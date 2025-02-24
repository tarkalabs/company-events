import { NextResponse } from 'next/server';
import { db } from '@/lib/firebase/config';
import { collection, getDocs } from 'firebase/firestore';
import { verifyAdminToken } from '@/lib/auth';

export async function GET(request: Request) {
  try {
    const authHeader = request.headers.get('Authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { error: 'Unauthorized - Admin access required' },
        { status: 401 }
      );
    }

    const token = authHeader.split('Bearer ')[1];
    if (!token || !(await verifyAdminToken(token))) {
      return NextResponse.json(
        { error: 'Invalid admin token' },
        { status: 401 }
      );
    }

    const eventsRef = collection(db, 'events');
    const snapshot = await getDocs(eventsRef);
    const events = snapshot.docs.map(doc => ({
      id: doc.id,
      day: doc.data().day,
      time: doc.data().time,
      session: doc.data().session,
      details: doc.data().details
    }));

    return NextResponse.json(events);
  } catch (error) {
    console.error('Error fetching events:', error);
    return NextResponse.json({ error: 'Failed to fetch events' }, { status: 500 });
  }
} 