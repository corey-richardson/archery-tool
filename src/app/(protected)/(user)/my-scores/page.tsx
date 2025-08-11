import { Metadata } from "next";
import Scorecards from "./scorecards";
import Link from "next/link";
import OverviewCard from "./OverviewCard";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/authOptions";

/** TODO: Add more sections to the Overview page and then uncomment link */

export const metadata: Metadata = {
    title: "My Scores",
};

async function MyScores() {

    const session = await getServerSession(authOptions);
    const userId = session?.user.id;

    return (
        <div className="wider content">
            <h3>My Scores.</h3>
            <p className="centred">
                This section displays your personal archery scores and records. You can review your performance history, track progress over time, and submit new scores. Use the links below to view a summary of your records or to add a new score after a competition or practice session. These scores are shared with the Club Records Officer for processing and to award classification and handicaps when you have achieved them.
            </p>

            <OverviewCard userId={userId} />

            <div className="wider scores-links">
                <Link href="/submit-score" className="link-button" style={{marginTop: "0"}}>Submit a Score</Link>
                {/* <Link href="/my-scores/overview" className="link-button">Records Overview</Link> */}
            </div>

            <Scorecards userId={userId} />
        </div>
    )
}

export default MyScores;
