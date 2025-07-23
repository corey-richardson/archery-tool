import { authOptions } from '@/app/api/auth/authOptions';
import { Metadata } from 'next';
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: 'Records Overview',
};

async function RecordsOverview() {

  return ( 
      <>
        <h1>Records Overview</h1>
      </>
    );
}
 
export default RecordsOverview;
