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
            <p className="centred">
                This page provides an overview of your current archery classification and handicap, based on your submitted scores. Review your progress, see your best performances, and track how your achievements compare to club and national standards. For details on how classifications and handicaps are calculated, consult your Club's Records Officer.
            </p>

            <OverviewCard userId={userId} />
        </div>
    );

    // TODO: Include 5 best scores by handicap?
}

export default RecordsOverview;
