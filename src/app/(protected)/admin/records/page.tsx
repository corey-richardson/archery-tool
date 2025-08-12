import { Metadata } from "next";
import prisma from "@/app/lib/prisma";
import RecordsManagement from "../components/RecordsManagement";
import { requireRecordsAccess } from "@/app/actions/requireAccess";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/authOptions";

export const metadata: Metadata = {
    title: "Records",
};

async function Records() {
    await requireRecordsAccess();

    const session = await getServerSession(authOptions);
    const userId = session.user.id;

    const memberships = await prisma.clubMembership.findMany({
        where: {
            userId,
            roles: {
                hasSome: [ "ADMIN", "RECORDS" ],
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

    const memberIds = [ ...new Set(members.map(m => m.userId)) ];

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
            dateShot: "desc",
        }
    })

    return (
        <div className="content" style={{ margin: "0 auto", padding: "2rem 3rem" }}>
            <h3 style={{ marginBottom: "2rem" }}>Submitted Scores.</h3>

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
