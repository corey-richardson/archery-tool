import { Metadata } from "next";

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

const MemberProfile = async ({ params }: { params: { id: string } }) => {
    const p = await params;
    const userId = p.id;

    return (
        <>
            <h1>GOOD MORNINGGGGG VIETNAM</h1>
            <p>{ userId }</p>
        </>
    );
}

export default MemberProfile;
