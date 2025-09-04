import { NextRequest, NextResponse } from "next/server";
import prisma from "@/app/lib/prisma";
import { requireLoggedInUser, requireAdminUser } from "@/app/lib/server-utils";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/authOptions";

export async function POST(req: NextRequest, context: any) {
    await requireAdminUser();

    const p = await context.params;
    const clubId = p.clubId;

    const { archeryGBNumber, invitedBy } = await req.json();

    if (!clubId || !archeryGBNumber || !invitedBy) {
        return NextResponse.json({ error: "Missing clubId, archeryGBNumber, or invitedBy" }, { status: 400 });
    }

    const user = await prisma.user.findFirst({ where: { archeryGBNumber } });

    const existingInvite = await prisma.invite.findFirst({
        where: {
            clubId,
            OR: [
                { archeryGBNumber },
                { userId: user?.id ?? undefined },
            ],
            status: "PENDING",
        },
    });

    if (existingInvite) {
        return NextResponse.json({ error: "Invite already exists for this user/number." }, { status: 409 });
    }

    if (user) {
        const existingMember = await prisma.clubMembership.findFirst({
            where: {
                clubId,
                userId: user?.id,
                endedAt: null,
            },
        });

        if (existingMember) {
            return NextResponse.json({ error: "This user is already a member of the club." }, { status: 409 });
        }
    }

    const invite = await prisma.invite.create({
        data: {
            clubId,
            userId: user?.id ?? null,
            archeryGBNumber,
            invitedBy,
            status: "PENDING",
        },
    });

    return NextResponse.json({ invite }, { status: 201 });
}

export async function GET(req: NextRequest, { params }: { params: { clubId: string } }) {
    await requireLoggedInUser();

    const p = await params;
    const clubId = p.clubId;
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
        return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const isAdmin = await prisma.clubMembership.findFirst({
        where: {
            clubId,
            userId: session.user.id,
            roles: { has: "ADMIN" },
        },
    });

    if (!isAdmin) {
        return NextResponse.json({ error: "Not authorised" }, { status: 403 });
    }

    const invites = await prisma.invite.findMany({
        where: {
            clubId,
            status: "PENDING",
        },
        include: {
            user: true,
            club: true,
        },
        orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ invites });
}