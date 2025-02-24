export async function verifyAdminToken(token: string): Promise<boolean> {
    try {
        // The token should be the admin ID which is 'admin'
        if (!token || token !== 'admin') {
            console.log('Invalid admin token:', token);
            return false;
        }

        // Check if admin credentials are configured
        if (!process.env.ADMIN_USERNAME || !process.env.ADMIN_PASSWORD) {
            console.error('Admin credentials not configured');
            return false;
        }

        return true;
    } catch (error) {
        console.error('Error verifying admin token:', error);
        return false;
    }
} 