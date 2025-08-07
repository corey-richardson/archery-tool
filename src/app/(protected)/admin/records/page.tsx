import { authOptions } from '@/app/api/auth/authOptions';
import { Metadata } from 'next';
import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import prisma from '@/app/lib/prisma';
import RecordsManagement from '../components/RecordsManagement';

export const metadata: Metadata = {
    title: 'Records',
};

async function Records() {
    const session = await getServerSession(authOptions);
    const isRecordsOrAdmin = session?.user?.memberships?.some((m: any) =>
        m.roles.includes("RECORDS") || m.roles.includes("ADMIN")
    );

    if (!session || !isRecordsOrAdmin) {
        redirect("/unauthorised?reason=not-authorised-for-records");
    }

    const userId = session.user.id;

    // Get all where where user has RECORDS or ADMIN role
    const memberships = await prisma.clubMembership.findMany({
        where: {
            userId,
            roles: {
                hasSome: ["ADMIN", "RECORDS"],
            },
        },
        select: {
            clubId: true,
        },
    });

    const clubIds = memberships.map(m => m.clubId);

    // Get all members in those clubs
    const members = await prisma.clubMembership.findMany({
        where: {
            clubId: { in: clubIds, },
        },
        select: {
            userId: true,
        },
    });

    const memberIds = [...new Set(members.map(m => m.userId))];

    // Get all scores for those members with no processedAt date
    const scores = await prisma.scores.findMany({
        where: {
            userId: { in: memberIds, },
            // processedAt: null,
        },
        include: {
            user: {
                select: {
                    name: true,
                    email: true,
                },
            },
        },
        orderBy: {
            dateShot: 'desc',
        }
    })

    return (
        <div style={{ margin: '0 auto', padding: '2rem 3rem' }}>
            <h2 style={{ marginBottom: '2rem' }}>Submitted Scores.</h2>

            {scores.length === 0 ? (
                <p>No scores found.</p>
            ) : (
                <RecordsManagement scores={scores.map(score => ({
                    ...score,
                    dateShot: score.dateShot instanceof Date ? score.dateShot.toISOString() : score.dateShot,
                    xs: score.xs === null ? undefined : score.xs,
                    tens: score.tens === null ? undefined : score.tens,
                    nines: score.nines === null ? undefined : score.nines,
                    hits: score.hits === null ? undefined : score.hits,
                    sex: score.sex === null ? undefined : score.sex,
                    roundIndoorClassification: score.roundIndoorClassification === null ? undefined : score.roundIndoorClassification,
                    roundOutdoorClassification: score.roundOutdoorClassification === null ? undefined : score.roundOutdoorClassification,
                    roundHandicap: score.roundHandicap === null ? undefined : score.roundHandicap,
                    notes: score.notes === null ? undefined : score.notes,

                    processedAt: score.processedAt === null
                        ? undefined
                        : (score.processedAt instanceof Date
                            ? score.processedAt.toISOString()
                            : score.processedAt),
                }))} />
            )}
        </div>
    );
}

export default Records;
