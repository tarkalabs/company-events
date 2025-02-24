import { NextResponse } from 'next/server';
import { getOrCreateUser } from '@/lib/db';

export async function POST(request: Request) {
    try {
        const { username, businessUnit } = await request.json();
        
        if (!username || !businessUnit) {
            return NextResponse.json({ 
                success: false, 
                error: 'Username and business unit are required' 
            }, { status: 400 });
        }

        console.log('[login] Attempting login for:', { username, businessUnit });
        
        const user = await getOrCreateUser(username, businessUnit);
        
        if (!user) {
            return NextResponse.json({ 
                success: false, 
                error: 'Failed to authenticate user' 
            }, { status: 401 });
        }

        return NextResponse.json({
            success: true,
            user: {
                id: user.id,
                username: user.username,
                businessUnit: user.businessUnit
            }
        });
    } catch (error) {
        console.error('[login] Error:', error);
        return NextResponse.json({ 
            success: false, 
            error: 'Login failed' 
        }, { status: 500 });
    }
}
//adding comment