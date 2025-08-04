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
            <p className="centred">Lorem ipsum dolor sit amet consectetur adipisicing elit. Quam maxime cum repellat officiis nemo hic doloribus. Quo, possimus tempora minima, mollitia eius ut pariatur, fugit blanditiis porro nesciunt exercitationem tempore.</p>

            <div className="forms">
                <ScoreSubmissionForm userId={session?.user.id} />
            </div>
        </div>
    );
}

export default SubmitScore;
