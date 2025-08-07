import { notFound } from "next/navigation";
import MemberManagementClient from '../../components/MemberManagementClient';
import { baseUrl } from "@/app/lib/constants";
import { cookies } from 'next/headers';

const MemberManagementPage = async ({ params }: { params: { id: string } }) => {
    const clubId = params.id;

    const cookieStore = cookies();
    const cookieHeader = cookieStore.toString();
    console.log(cookieHeader);

    const res = await fetch(`${baseUrl}/api/club/${clubId}`, {
        headers: { 
            'Content-Type': 'application/json' ,
            'Cookie': cookieHeader
        },
        cache: 'no-store',
    });

    if (!res.ok) return notFound();

    console.log(res);
    const club = await res.json();

    if (!club) return notFound();

    return (
        <div className="content wider" style={{ margin: '0 auto', padding: '0 1rem' }}>
            <h3>Manage Members for {club.club.name}.</h3>
            <MemberManagementClient club={club} />
        </div>
    );
}

export default MemberManagementPage;
