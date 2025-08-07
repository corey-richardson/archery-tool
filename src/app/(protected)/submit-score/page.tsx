import { Metadata } from 'next';
import ScoreSubmissionForm from './form';
import { getServerSession } from "next-auth";
import { authOptions } from '@/app/api/auth/authOptions';

export const metadata: Metadata = {
    title: 'Submit a Score',
};

async function SubmitScore() {
    const session = await getServerSession(authOptions);

    return (
        <div className="wider content">
            <h3>Submit a Score to the Records Officer.</h3>
            <p className="centred">
                Use this form to submit your latest archery score to your club's records officer. Accurate score submissions help maintain your classification and handicap, and ensure club records are up to date. Please fill in all required fields and double-check your entry before submitting.
            </p>

            <div className="forms">
                <ScoreSubmissionForm userId={session?.user.id} />
            </div>
        </div>
    );
}

export default SubmitScore;
