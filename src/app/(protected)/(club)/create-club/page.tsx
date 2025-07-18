import { Metadata } from 'next';
import { getServerSession } from "next-auth";
import { authOptions } from '@/app/api/auth/authOptions';
import prisma from "@/app/lib/prisma";

export const metadata: Metadata = {
  title: 'Create a New Club',
};

async function MyDetails() {
    const session = await getServerSession(authOptions);

    const id = session?.user.memberships?.[0]?.clubId;
    const club = await prisma.club.findUnique({ where: { id }})

    return ( 
        <>
          <h2>Hello, <b className="blue">{ session?.user.name }</b>.</h2>
          <p>{ session?.user.id }</p>

          <p>{ club.name }</p>

          
          {session?.user.memberships?.map((m: any) => (
            <div key={m.clubId}>
                <p>Club ID: {m.clubId}</p>
                <p>Roles: {m.roles.join(', ')}</p>
            </div>
            ))}
        </>
     );
}
 
export default MyDetails;