import { getServerSession } from "next-auth";
import { authOptions } from '@/app/api/auth/authOptions';
import { notFound } from "next/navigation";
import { redirect } from "next/navigation";
import MemberManagementClient from '../../components/MemberManagementClient';

const MemberManagementPage = async ({ params }: { params: { id: string } }) => {
    const clubId = params.id;
    const session = await getServerSession(authOptions);

    console.log("Current clubId:", clubId);
    console.log("User memberships:", session?.user?.memberships);

    const admin = session?.user?.memberships?.some(
        (m: any) =>
            m.clubId === clubId &&
      Array.isArray(m.roles) &&
      m.roles.map((r: string) => r.trim().toUpperCase()).includes("ADMIN")
    );

    console.log("Is admin of this club:", admin);

    if (!session || !admin ) {
        redirect("/unauthorised?reason=not-an-admin");
    }

    const res = await fetch(`${process.env.NEXTAUTH_URL || ''}/api/club/${clubId}`, {
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
