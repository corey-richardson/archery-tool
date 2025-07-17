import { authOptions } from '@/app/api/auth/authOptions';
import { Metadata } from 'next';
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: 'Records',
};

async function Records() {
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== "ADMIN") {
    redirect("/unauthorised");
  }

  return ( 
      <></>
    );
}
 
export default Records;
