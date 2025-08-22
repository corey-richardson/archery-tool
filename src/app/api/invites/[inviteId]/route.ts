import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import prisma from "@/app/lib/prisma";
import { authOptions } from "@/app/api/auth/authOptions";
import { requireLoggedInUser } from "@/app/lib/server-utils";

interface Membership {
    roles: string[];
}

export async function POST(req: Request, { params }: { params: { inviteId: string } })
{
    await requireLoggedInUser();

    const p = await params;
    const inviteId = p.inviteId;

    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
        return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const invite = await prisma.invite.findUnique({
        where: { id: inviteId },
    });
    if (!invite || invite.userId !== session.user.id) {
        return NextResponse.json({ error: "Invite not found" }, { status: 404 });
    }

    const existingMembership = await prisma.clubMembership.findFirst({
        where: {
            userId: session.user.id,
            clubId: invite.clubId,
            endedAt: null,
        },
    });

    if (existingMembership) {
        await prisma.invite.delete({ where: { id: inviteId } });
        return NextResponse.json({ error: "Already a member" }, { status: 409 });
    }

    await prisma.clubMembership.create({
        data: {
            userId: session.user.id,
            clubId: invite.clubId,
            roles: [ "MEMBER" ],
        },
    });

    await prisma.invite.update({
        where: { id: inviteId },
        data: { status: "ACCEPTED", acceptedAt: new Date() },
    });
    return NextResponse.json({ success: true });
}


export async function DELETE(req: Request, { params }: { params: { inviteId: string } })
{
    const requestor = await requireLoggedInUser();
    const p = await params;
    const inviteId = p.inviteId;

    const session = await getServerSession(authOptions);
    const sessionUserId = session?.user?.id;

    if (!sessionUserId) {
        return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const invite = await prisma.invite.findUnique({
        where: { id: inviteId },
    });

    const isRecordsOrHigher = requestor.memberships.some((membership: Membership) =>
        membership.roles.includes("ADMIN") || membership.roles.includes("CAPTAIN") || membership.roles.includes("RECORDS")
    );

    if (!invite) {
        return NextResponse.json({ error: "Invite not found" }, { status: 404 });
    }

    if (!(isRecordsOrHigher || invite.userId == sessionUserId)) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    await prisma.invite.delete({ where: { id: inviteId } });
    return NextResponse.json({ success: true });
}
