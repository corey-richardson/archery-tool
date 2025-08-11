import RecordsManagement from "../../../components/RecordsManagement";
import prisma from "@/app/lib/prisma";
import RecordsOverviewManagement from "../../../components/RecordsOverviewManagement";

const RecordProfile = async ({ params, searchParams }: { params: { id: string }; searchParams: { [key: string]: string | undefined } }) => {
    const p = await params;
    const sp = await searchParams;

    const userId = p.id;
    const userName = sp.name;

    let scores: Array<any> = [];
    try {
        scores = await prisma.scores.findMany({
            where: { userId },
            orderBy: [
                { dateShot: "desc" },
                { submittedAt: "desc" }
            ],
            include: {
                user: true,
            },
        });

    } catch (error) {
        console.error(error);
    }

    return (
        <div style={{ margin: '0 auto', padding: '2rem 3rem' }}>

            <h2 style={{ marginBottom: '2rem' }}>Records Overview for { userName }:</h2>
            <RecordsOverviewManagement userId={userId} />

            <h2 style={{ marginBottom: '2rem', marginTop: '2rem' }}>Scores submitted by { userName }:</h2>
            <RecordsManagement initialScores={scores} />
        </div>
    );
}

export default RecordProfile;
