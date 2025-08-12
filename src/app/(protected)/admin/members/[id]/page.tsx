import { notFound } from "next/navigation";
import MemberManagementClient from "../../components/MemberManagementClient";
import { baseUrl } from "@/app/lib/constants";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { Metadata } from "next";
import { requireCaptainsAccess, checkAdminsAccess } from "@/app/actions/requireAccess";

type props = {
    params: { id: string }
    searchParams: { [key: string]: string | undefined }
}

export async function generateMetadata(
    { searchParams }: props
): Promise<Metadata> {
    const sp = await searchParams;
    const clubName = sp.name ?? "Unknown Club";
    return {
        title: clubName,
    }
}

const MemberManagementPage = async ({ params, searchParams }: props) => {
    await requireCaptainsAccess();
    const admin = await checkAdminsAccess();

    const p = await params;
    const sp = await searchParams;
    const clubId = p.id;
    const clubName = sp.name ?? "Unknown Club";

    const cookieStore = await cookies();
    const cookieHeader = cookieStore.getAll().map(c => `${c.name}=${c.value}`).join("; ");

    const res = await fetch(`${baseUrl}/api/club/${clubId}`, {
        headers: {
            "Content-Type": "application/json",
            "Cookie": cookieHeader,
        },
    });

    if (!res.ok) return notFound();
    if (res.headers.get("content-type")?.includes("text/html")) redirect("/unauthorised?reason=not-logged-in");

    const club = await res.json();

    if (!club) return notFound();

    return (
        <div className="content wider" style={{ margin: "0 auto", padding: "0 1rem" }}>
            <h3>Manage Members for {clubName}.</h3> {/** club.club.name */}
            <MemberManagementClient club={club} admin={admin} />
        </div>
    );
}

export default MemberManagementPage;
