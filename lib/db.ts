import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient({
    log: ['query', 'error', 'warn'],
});

// Add this to test the connection
prisma.$connect()
    .then(() => console.log('Successfully connected to the database'))
    .catch((e) => console.error('Failed to connect to the database:', e));

export interface Event {
    id?: string;
    Day: number;
    Time: string;
    Session: string;
    Details: string | null;
}

export interface EventFeedback {
    eventId: string;
    userId: string;
    rating: number;
    comments: string;
}

export async function getEvents() {
    const events = await prisma.event.findMany({
        orderBy: [
            { day: 'asc' },
            { time: 'asc' }
        ],
        include: {
            feedbacks: true
        },
    });

    // Transform the data to match the expected format
    return events.map(event => ({
        id: event.id,
        Day: event.day,
        Time: event.time,
        Session: event.session,
        Details: event.details
    }));
}

export async function submitFeedback(feedback: {
    eventId: string;
    userId: string;
    rating: number;
    comments: string;
}) {
    try {
        console.log('Submitting feedback:', feedback);
        const result = await prisma.feedback.upsert({
            where: {
                eventId_userId: {
                    eventId: feedback.eventId,
                    userId: feedback.userId,
                }
            },
            update: {
                rating: feedback.rating,
                comments: feedback.comments,
            },
            create: feedback,
        });
        console.log('Feedback submitted successfully:', result);
        return result;
    } catch (error) {
        console.error('Error submitting feedback:', error);
        throw error;
    }
}

export async function getEventFeedback(eventId: string, userId: string) {
    return prisma.feedback.findFirst({
        where: {
            eventId,
            userId,
        },
    });
}

export async function createUser(username: string, businessUnit: string) {
    try {
        console.log('Creating user with data:', { username, businessUnit });
        const user = await prisma.user.create({
            data: {
                username,
                businessUnit,
            },
        });
        console.log('User created in database:', user);
        return user;
    } catch (error) {
        console.error('Error creating user:', error);
        throw error;
    }
}

export async function getUser(username: string) {
    try {
        console.log('Looking up user:', username);
        const user = await prisma.user.findUnique({
            where: { username },
        });
        console.log('User lookup result:', user);
        return user;
    } catch (error) {
        console.error('Error finding user:', error);
        throw error;
    }
}

export async function getAllFeedbacks() {
    return prisma.feedback.findMany({
        include: {
            event: true,
            user: true,
        },
    });
}

export async function checkDatabaseState() {
    try {
        const users = await prisma.user.findMany();
        const events = await prisma.event.findMany();
        const feedbacks = await prisma.feedback.findMany();

        console.log('Database State:');
        console.log('Users:', users);
        console.log('Events:', events);
        console.log('Feedbacks:', feedbacks);

        return {
            users,
            events,
            feedbacks
        };
    } catch (error) {
        console.error('Error checking database state:', error);
        throw error;
    }
} 