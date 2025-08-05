import { getServerSession } from "next-auth";
import { authOptions } from '@/app/api/auth/authOptions';
import { notFound } from "next/navigation";
import { redirect } from "next/navigation";
import MemberManagementClient from '../../components/MemberManagementClient';
import { baseUrl } from "@/app/lib/constants";

const MemberManagementPage = async ({ params }: { params: { id: string } }) => {
    const clubId = params.id;
    const session = await getServerSession(authOptions);

    const admin = session?.user?.memberships?.some(
        (m: any) =>
            m.clubId === clubId &&
      Array.isArray(m.roles) &&
      m.roles.map((r: string) => r.trim().toUpperCase()).includes("ADMIN")
    );

    if (!session || !admin ) {
        redirect("/unauthorised?reason=not-an-admin");
    }

    const res = await fetch(`${baseUrl}/api/club/${clubId}`, {
        headers: { 'Content-Type': 'application/json' },
        cache: 'no-store',
    });

    if (!res.ok) return notFound();

    const club = await res.json();

    if (!club) return notFound();

    return (
        <div className="wider" style={{ margin: '0 auto', padding: '2rem 1rem' }}>
            <h2 style={{ marginBottom: '2rem' }}>Manage Members for {club.club.name}.</h2>
            <MemberManagementClient club={club} />
        </div>
    );
}

export default MemberManagementPage;
