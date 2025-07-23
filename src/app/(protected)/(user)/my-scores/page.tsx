import { Metadata } from 'next';
import Scorecards from './scorecards';

import { getServerSession } from "next-auth";
import { authOptions } from '@/app/api/auth/authOptions';

export const metadata: Metadata = {
  title: 'My Scores',
};

async function MyScores() {

    const session = await getServerSession(authOptions);
    const userId = session?.user.id;

    return (
        <div className="wider content">
            <h3>My Scores.</h3>
            <p className="centred">Lorem ipsum dolor sit amet consectetur adipisicing elit. Harum iste delectus quod maiores quaerat ipsam soluta beatae itaque eum deserunt. Fugiat, pariatur mollitia blanditiis rem molestias corporis voluptate in. Soluta.</p>
            <Scorecards userId={userId} />
        </div>
    )
}

export default MyScores;
