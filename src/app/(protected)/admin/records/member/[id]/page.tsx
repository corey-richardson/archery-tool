import RecordsManagement from "../../../components/RecordsManagement";
import prisma from "@/app/lib/prisma";

const RecordProfile = async ({ params, searchParams }: { params: { id: string }; searchParams: { [key: string]: string | undefined } }) => {
    const userId = await params.id;
    console.log(userId);
    console.log(searchParams.name);

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

            <h2 style={{ marginBottom: '2rem' }}>Records Overview for { searchParams.name }:</h2>
            <p>todo</p>

            <h2 style={{ marginBottom: '2rem', marginTop: '2rem' }}>Scores submitted by { searchParams.name }:</h2>
            <RecordsManagement scores={scores}/>
        </div>
    );
}

export default RecordProfile;
