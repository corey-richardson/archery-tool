import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import prisma from "@/app/lib/prisma";
import { authOptions } from "@/app/api/auth/authOptions";
import { requireLoggedInUser } from "@/app/lib/server-utils";

interface Membership {
    roles: string[];
}

export async function DELETE(req: Request, { params }: { params: { inviteId: string } })
{
    const requestor = await requireLoggedInUser();
    const p = await params;
    const inviteId = p.inviteId;

    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
        return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const invite = await prisma.invite.findUnique({
        where: { id: inviteId },
    });

    const isRecordsOrAdmin = requestor.memberships.some((membership: Membership) => 
        membership.roles.includes('ADMIN') || membership.roles.includes('RECORDS')
    );

    if (!isRecordsOrAdmin) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    if (!invite) {
        return NextResponse.json({ error: "Invite not found" }, { status: 404 });
    }

    await prisma.invite.delete({ where: { id: inviteId } });
    return NextResponse.json({ success: true });
}
