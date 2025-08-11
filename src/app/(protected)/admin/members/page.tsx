import { authOptions } from "@/app/api/auth/authOptions";
import { Metadata } from "next";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
    title: "Members",
};

async function Members() {
    const session = await getServerSession(authOptions);

    const activeMembership = session?.user?.memberships?.find(
        (m: any) => m.endedAt === null
    );

    const admin = activeMembership && (activeMembership.roles.includes("ADMIN") || activeMembership.roles.includes("CAPTAIN"));

    if (!session || !admin ) {
        redirect("/unauthorised?reason=not-an-admin");
    }

    return (
        <></>
    );
}

export default Members;
