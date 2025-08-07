import { NextRequest, NextResponse } from "next/server";
import prisma from "@/app/lib/prisma";
import { requireLoggedInUser } from "@/app/lib/server-utils";

export async function POST(request: NextRequest) {
    await requireLoggedInUser();

    const { clubId, userId } = await request.json();
    if (!clubId || !userId) {
        return NextResponse.json({ error: "Missing clubId or userId." }, { status: 400 });
    }

    try {
        const membership = await prisma.clubMembership.findFirst({
            where: { clubId, userId, endedAt: null },
        });

        if (!membership) {
            return NextResponse.json({ error: "Membership not found." }, { status: 404 });
        }

        if (membership.roles.includes("ADMIN")) {
            const adminCount = await prisma.clubMembership.count({
                where: {
                    clubId,
                    roles: {  has: "ADMIN" },
                    NOT: {userId },
                }
            });

            console.log(adminCount);

            if (adminCount == 0) {
                return NextResponse.json({ error: "You cannot leave as the only admin. Please assign another member to be an admin or delete the club." }, { status: 403 });
            }
        }

        await prisma.clubMembership.update({
            where: { id: membership.id },
            data: { endedAt: new Date() },
        });

        return NextResponse.json({ success: true }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ error: "Failed to leave club." }, { status: 500 });
    }
}
