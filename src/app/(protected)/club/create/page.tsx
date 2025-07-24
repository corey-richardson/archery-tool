import { Metadata } from 'next';
import { getServerSession } from "next-auth";
import { authOptions } from '@/app/api/auth/authOptions';
import CreateClub from './createClub';

export const metadata: Metadata = {
  title: 'Create a New Club',
};

async function CreateClubPage() {
    const session = await getServerSession(authOptions);

    return ( 
        <div className="forms">
          <CreateClub />
        </div>
     );
}
 
export default CreateClubPage;
