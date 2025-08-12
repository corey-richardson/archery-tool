import { authOptions } from "@/app/api/auth/authOptions";
import { Metadata } from "next";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { requireCaptainsAccess } from "@/app/actions/requireAccess";

export const metadata: Metadata = {
    title: "Members",
};

async function Members() {
    await requireCaptainsAccess()

    return (
        <></>
    );
}

export default Members;
