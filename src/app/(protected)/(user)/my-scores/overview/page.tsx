import { Metadata } from 'next';

import { getServerSession } from "next-auth";
import { authOptions } from '@/app/api/auth/authOptions';
import OverviewCard from './card';

export const metadata: Metadata = {
    title: 'Records Overview',
};

async function RecordsOverview() {
    const session = await getServerSession(authOptions);
    const userId = session?.user.id;

    return (
        <div className="wider content">
            <h3>My Records Overview.</h3>
            <p className="centred">Lorem ipsum dolor sit amet consectetur adipisicing elit. Harum iste delectus quod maiores quaerat ipsam soluta beatae itaque eum deserunt. Fugiat, pariatur mollitia blanditiis rem molestias corporis voluptate in. Soluta.</p>

            <OverviewCard userId={userId} />
        </div>
    );

    // TODO: Include 5 best scores by handicap?
}

export default RecordsOverview;
