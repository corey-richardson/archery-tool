import { Metadata } from 'next';
import { getServerSession } from "next-auth";
import { authOptions } from '@/app/api/auth/authOptions';
import DetailsForm from '@/app/ui/details/details-form';
import EmergencyContactsForm from '@/app/ui/details/ice-form';
import ClubCards from './ClubCards';

export const metadata: Metadata = {
    title: 'My Details',
};

async function MyDetails() {
    const session = await getServerSession(authOptions);
    const userId = session?.user.id;

    return (
        <>
            <div className="forms details-grid">
                <DetailsForm userId={session?.user.id} />
                <EmergencyContactsForm user={session?.user} />

                <div className="club-cards-full-width">
                    <ClubCards userId={userId} />
                </div>
            </div>
        </>
    );
}

export default MyDetails;