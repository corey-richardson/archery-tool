import { Metadata } from 'next';
import { getServerSession } from "next-auth";
import { authOptions } from '@/app/api/auth/authOptions';
import DetailsForm from '@/app/ui/details/form';

export const metadata: Metadata = {
  title: 'My Details',
};

async function MyDetails() {
    const session = await getServerSession(authOptions);

    return ( 
        <>   
          <DetailsForm user={session?.user} />
        </>
     );
}
 
export default MyDetails;