import { NextResponse } from 'next/server';
import { verifyAdmin } from '@/lib/db';

export async function POST(request: Request) {
    try {
        const { username, password } = await request.json();
        
        if (!username || !password) {
            return NextResponse.json({ 
                success: false, 
                error: 'Username and password are required' 
            }, { status: 400 });
        }

        console.log('[admin] Login attempt:', { username });
        
        if (!process.env.ADMIN_USERNAME || !process.env.ADMIN_PASSWORD) {
            console.error('[admin] Admin credentials not configured in environment');
            return NextResponse.json({ 
                success: false, 
                error: 'Admin authentication not configured' 
            }, { status: 500 });
        }

        const admin = await verifyAdmin(username, password);
        
        if (!admin) {
            return NextResponse.json({ 
                success: false, 
                error: 'Invalid admin credentials' 
            }, { status: 401 });
        }

        return NextResponse.json({
            success: true,
            admin: {
                id: admin.id,
                username: admin.username
            }
        });
    } catch (error) {
        console.error('[admin] Login error:', error);
        return NextResponse.json({ 
            success: false, 
            error: 'Login failed' 
        }, { status: 500 });
    }
} 