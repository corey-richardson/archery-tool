import { NextRequest, NextResponse } from "next/server";
import prisma from "@/app/lib/prisma";
import { requireLoggedInUser } from "@/app/lib/server-utils";

export async function DELETE(request: NextRequest, { params }: { params: { clubId: string; userId: string } } ) {
    const user = await requireLoggedInUser();

    const { clubId, userId } = await params;

    if (!clubId || !userId) {
        return NextResponse.json({ error: "Missing clubId or userId." }, { status: 400 });
    }

    try {
        const membership = await prisma.clubMembership.findFirst({
            where: { clubId, userId, endedAt: null },
            include: { user: true, club: true }
        });

        if (!membership) {
            return NextResponse.json({ error: "Membership not found." }, { status: 404 });
        }

        if (membership.clubId !== clubId) {
            return NextResponse.json({ error: "Membership does not belong to this club." }, { status: 400 });
        }

        if (membership.endedAt) {
            return NextResponse.json({ error: "Membership is already ended." }, { status: 400 });
        }

        const userMembership = await prisma.clubMembership.findFirst({
            where: {
                clubId,
                userId: user.id,
                endedAt: null,
                roles: { has: "ADMIN" }
            }
        });

        const isUserLeavingOwnMembership = membership.userId === user.id;
        const isAdmin = userMembership !== null;

        if (!isUserLeavingOwnMembership && !isAdmin) {
            return NextResponse.json({
                error: "You can only leave your own membership or you must be an admin to remove others."
            }, { status: 403 });
        }

        if (membership.roles.includes("ADMIN")) {
            const adminCount = await prisma.clubMembership.count({
                where: {
                    clubId,
                    roles: { has: "ADMIN" },
                    endedAt: null,
                    NOT: { id: membership.id }
                }
            });

            if (adminCount === 0) {
                return NextResponse.json({
                    error: "You cannot leave as the only admin. Please assign another member to be an admin or delete the club."
                }, { status: 403 });
            }
        }

        await prisma.clubMembership.update({
            where: { id: membership.id },
            data: { endedAt: new Date() },
        });

        return NextResponse.json({
            success: true,
            message: `Membership ended successfully.`
        }, { status: 200 });

    } catch (error) {
        console.error("Error ending membership:", error);
        return NextResponse.json({ error: "Failed to end membership: " + error }, { status: 500 });
    }
}
