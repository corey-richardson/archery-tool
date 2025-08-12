import { Metadata } from "next";
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
