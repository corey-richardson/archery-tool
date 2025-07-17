import { Metadata } from 'next';
import { getServerSession } from "next-auth";
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

export const metadata: Metadata = {
  title: 'My Details',
};

async function MyDetails() {
    const session = await getServerSession(authOptions);

    return ( 
        <>
          <h2>Hello, <b className="blue">{ session.user.name }</b>.</h2>
          <p>{ session.user.id }</p>
        </>
     );
}
 
export default MyDetails;