import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/authOptions';
import prisma from '@/app/lib/prisma';

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
    try {
        const session = await getServerSession(authOptions);

        if (!session) {
            return NextResponse.json({ error: 'Unauthorised' }, { status: 401 });
        }

        // Check if user has RECORDS or ADMIN role
        const isRecordsOrAdmin = session?.user?.memberships?.some((m: any) =>
            m.roles.includes("RECORDS") || m.roles.includes("ADMIN")
        );

        if (!isRecordsOrAdmin) {
            return NextResponse.json({ error: 'Insufficient permissions' }, { status: 403 });
        }

        const { processedAt } = await request.json();

        if (!processedAt) {
            return NextResponse.json({ error: 'processedAt is required' }, { status: 400 });
        }

        // Update the score with processedAt timestamp
        const updatedScore = await prisma.scores.update({
            where: {
                id: params.id,
            },
            data: {
                processedAt: new Date(processedAt),
            },
        });

        return NextResponse.json({
            message: 'Score processed successfully',
            score: updatedScore,
        });

    } catch (error) {
        console.error('Error processing score:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}
