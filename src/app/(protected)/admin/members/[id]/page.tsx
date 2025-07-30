import { getServerSession } from "next-auth";
import { authOptions } from '@/app/api/auth/authOptions';
import { notFound } from "next/navigation";
import MemberManagementClient from '../../components/MemberManagementClient';

interface Props {
  params: { id: string };
}

export default async function MemberManagementPage({ params }: Props) {
  const session = await getServerSession(authOptions);
  if (!session) return notFound();

  const res = await fetch(`${process.env.NEXTAUTH_URL || ''}/api/club/${params.id}`, {
    headers: { 'Content-Type': 'application/json' },
    cache: 'no-store',
  });

  if (!res.ok) return notFound();

  const club = await res.json();

  if (!club) return notFound();

  console.log(club.members);

  return (
    <div className="wider" style={{ margin: '0 auto', padding: '2rem 1rem' }}>
      <h2 style={{ marginBottom: '2rem' }}>Manage Members for {club.club.name}.</h2>
      <MemberManagementClient club={club} />
    </div>
  );
}
