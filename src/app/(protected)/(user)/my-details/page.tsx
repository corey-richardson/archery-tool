import { Metadata } from 'next';
import { getServerSession } from "next-auth";
import { authOptions } from '@/app/api/auth/authOptions';
import DetailsForm from '@/app/ui/details/form';
import EmergencyContactsForm from '@/app/ui/details/ice-form';

export const metadata: Metadata = {
  title: 'My Details',
};

async function MyDetails() {
    const session = await getServerSession(authOptions);
    if (!session) {
      // ???
    }

    return ( 
        <div className="forms">   
          <DetailsForm user={session?.user} />
          <EmergencyContactsForm user={session?.user} />
        </div>
     );
}
 
export default MyDetails;