import { authOptions } from '@/app/api/auth/authOptions';
import { Metadata } from 'next';
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: 'Members',
};

async function Members() {
  const session = await getServerSession(authOptions);
  const admin = session?.user?.memberships?.some((m: any) => m.roles.includes("ADMIN"));

  if (!session || !admin ) {
    redirect("/unauthorised");
  }

  return ( 
      <></>
    );
}
 
export default Members;
