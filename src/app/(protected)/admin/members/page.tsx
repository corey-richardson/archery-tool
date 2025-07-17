import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { Metadata } from 'next';
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: 'Members',
};

async function Members() {
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== "ADMIN") {
    redirect("/unauthorised");
  }

  return ( 
      <></>
    );
}
 
export default Members;
