import { Metadata } from "next";
import ProfileClient from "./ProfileClient";
import { requireCaptainsAccess } from "@/app/actions/requireAccess";

type props = {
    params: { id: string }
    searchParams: { [key: string]: string | undefined }
}

export async function generateMetadata(
    { searchParams }: props
): Promise<Metadata> {
    const sp = await searchParams;
    const userName = sp.name ?? "Unknown User";
    return {
        title: userName,
    }
}

const MemberProfile = async ({ params, searchParams }: props) => {
    await requireCaptainsAccess();

    const p = await params;
    const userId = p.id;
    const sp = await searchParams;
    const userName = sp.name ?? "Unknown User";

    return (
        <div className="content" style={{ margin: "0 auto", padding: "2rem 3rem" }}>
            <h3 className="blue" style={{ marginBottom: "2rem" }}>Member Management for { userName }:</h3>
            <ProfileClient userId={userId} />
        </div>
    );
}

export default MemberProfile;
