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

    const activeMembership = session?.user?.memberships?.find(
        (m: any) => m.endedAt === null
    );

    const hasRecordsAccess = activeMembership && (activeMembership.roles.includes("ADMIN") || activeMembership.roles.includes("CAPTAIN"));

    if (!session || !hasRecordsAccess) {
        redirect("/unauthorised?reason=not-authorised-for-records");
    }

    const userId = session.user.id;

    const memberships = await prisma.clubMembership.findMany({
        where: {
            userId,
            roles: {
                hasSome: ["ADMIN", "RECORDS"],
            },
            endedAt: null,
        },
        select: {
            clubId: true,
        },
    });

    const clubIds = memberships.map(m => m.clubId);

    const members = await prisma.clubMembership.findMany({
        where: {
            clubId: { in: clubIds, },
            endedAt: null,
        },
        select: {
            userId: true,
        },
    });

    const memberIds = [...new Set(members.map(m => m.userId))];

    const scores = await prisma.scores.findMany({
        where: {
            userId: { in: memberIds, },
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

    const filterModel = {
        items: [
            {
                field: 'processedAt',
                operator: 'isEmpty',
                id: 1,
            },
        ],
    };

    return (
        <div style={{ margin: '0 auto', padding: '2rem 3rem' }}>
            <h2 style={{ marginBottom: '2rem' }}>Submitted Scores.</h2>

            {scores.length === 0 ? (
                <p>No scores found.</p>
            ) : (
                <RecordsManagement initialScores={scores.map(score => ({
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
                    ageCategory: score.ageCategory === null ? "" : score.ageCategory,
                    processedAt: score.processedAt === null
                        ? undefined
                        : (score.processedAt instanceof Date
                            ? score.processedAt.toISOString()
                            : score.processedAt),
                    user: {
                        id: score.userId,
                        name: score.user?.name,
                        email: score.user?.email,
                    },
                }))} />
            )}
        </div>
    );
}

export default Records;
