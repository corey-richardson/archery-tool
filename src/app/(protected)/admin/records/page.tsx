import { authOptions } from '@/app/api/auth/authOptions';
import { Metadata } from 'next';
import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import prisma from '@/app/lib/prisma';

export const metadata: Metadata = {
  title: 'Records',
};

type Score = {
  id: string;
  user: {
    name: string;
    email: string;
    archeryGBNumber: string | null;
  };
  dateShot: string;
  roundName: string;
  score: number;
  bowstyle: string;
  roundType: string;
  competitionLevel: string;
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
            processedAt: null,
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
    <main className="p-4 space-y-4">
      <h1 className="text-2xl font-semibold">Submitted Scores</h1>

      {scores.length === 0 ? (
        <p>No scores found.</p>
      ) : (
        <ul className="space-y-2">
          {scores.map(score => (
            <div key={score.id}>
                <li className="border p-4 rounded shadow-sm">
                <p><strong>Archer:</strong> {score.user.name} ({score.user.email})</p>
                <p><strong>Date Shot:</strong> {new Date(score.dateShot).toLocaleDateString()}</p>
                <p><strong>Round:</strong> {score.roundName}</p>
                <p><strong>Score:</strong> {score.score}</p>
                <p><strong>Bowstyle:</strong> {score.bowstyle}</p>
                <p><strong>Round Type:</strong> {score.roundType}</p>
                <p><strong>Competition Level:</strong> {score.competitionLevel}</p>
                </li>
                <hr />
            </div>
          ))}
        </ul>
      )}
    </main>
  );
}

export default Records;
