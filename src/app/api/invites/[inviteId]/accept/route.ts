import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import prisma from "@/app/lib/prisma";
import { authOptions } from "@/app/api/auth/authOptions";
import { requireLoggedInUser } from "@/app/lib/server-utils";

export async function POST(req: Request, { params }: { params: { inviteId: string } })
{
    await requireLoggedInUser();

    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
        return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const invite = await prisma.invite.findUnique({
        where: { id: await params.inviteId },
    });
    if (!invite || invite.userId !== session.user.id) {
        return NextResponse.json({ error: "Invite not found" }, { status: 404 });
    }

    const existingMembership = await prisma.clubMembership.findUnique({
        where: {
            userId_clubId: {
                userId: session.user.id,
                clubId: invite.clubId,
            },
        },
    });

    if (existingMembership) {
        await prisma.invite.delete({ where: { id: params.inviteId } });
        return NextResponse.json({ error: "Already a member" }, { status: 409 });
    }

    await prisma.clubMembership.create({
        data: {
            userId: session.user.id,
            clubId: invite.clubId,
            roles: ["MEMBER"],
        },
    });

    await prisma.invite.update({
        where: { id: params.inviteId },
        data: { status: "ACCEPTED", acceptedAt: new Date() },
    });
    return NextResponse.json({ success: true });
}
