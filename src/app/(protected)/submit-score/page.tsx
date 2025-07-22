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
        <div className="forms">
          <ScoreSubmissionForm userId={session?.user.id} />
        </div>
     );
}
 
export default SubmitScore;
