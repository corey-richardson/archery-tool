import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/authOptions';
import prisma from '@/app/lib/prisma';

export async function GET() {
    try {
        const session = await getServerSession(authOptions);
        
        if (!session?.user?.id) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const invites = await prisma.invite.findMany({
            where: {
                userId: session.user.id,
                status: "PENDING",
            },
            include: {
                club: {
                    select: {
                        id: true,
                        name: true,
                    }
                },
                inviter: {
                    select: {
                        name: true,
                    }
                }
            },
            orderBy: {
                createdAt: 'desc'
            }
        });

        return NextResponse.json({ invites });

    } catch (error) {
        console.error('Error fetching user invites:', error);
        return NextResponse.json(
            { error: 'Failed to fetch invites' },
            { status: 500 }
        );
    }
}