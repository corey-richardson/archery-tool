import { notFound } from "next/navigation";
import MemberManagementClient from '../../components/MemberManagementClient';
import { baseUrl } from "@/app/lib/constants";
import { redirect } from "next/navigation";
import { cookies } from 'next/headers';
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/authOptions";

const MemberManagementPage = async ({ params }: { params: { id: string } }) => {
    const p = await params;
    const clubId = p.id;

    const session = await getServerSession(authOptions);
    const admin = session?.user?.memberships?.some(
        (m: any) => m.clubId === clubId && m.roles.includes("ADMIN")
    );

    if (!session || !admin ) {
        redirect("/unauthorised?reason=not-an-admin");
    }

    const cookieStore = await cookies();
    const cookieHeader = cookieStore.getAll().map(c => `${c.name}=${c.value}`).join('; ');

    const res = await fetch(`${baseUrl}/api/club/${clubId}`, {
        headers: {
            'Content-Type': 'application/json',
            'Cookie': cookieHeader,
        },
    });

    if (!res.ok) return notFound();
    if (res.headers.get("content-type")?.includes("text/html")) redirect("/unauthorised?reason=not-logged-in");

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
