import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import prisma from "@/app/lib/prisma";
import { authOptions } from "@/app/api/auth/authOptions";
import { requireLoggedInUser } from "@/app/lib/server-utils";

export async function DELETE(req: Request, { params }: { params: { inviteId: string } })
{
    await requireLoggedInUser();

    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
        return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const invite = await prisma.invite.findUnique({
        where: { id: params.inviteId },
    });

    if (!invite || invite.userId !== session.user.id) {
        return NextResponse.json({ error: "Invite not found" }, { status: 404 });
    }

    await prisma.invite.delete({ where: { id: params.inviteId } });
    return NextResponse.json({ success: true });
}
