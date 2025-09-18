import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/authOptions";
import prisma from "@/app/lib/prisma";
import { requireLoggedInUser } from "@/app/lib/server-utils";

/**
 * @swagger
 * /api/users/invites:
 *   get:
 *     tags:
 *       - Invites
 *     summary: Get pending invites for the current user
 *     description: Retrieves all pending invites for the currently authenticated user, matching either their user ID or ArcheryGB number.
 *     responses:
 *       200:
 *         description: List of pending invites retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 invites:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Invite'
 *       401:
 *         description: Not authenticated
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       404:
 *         description: Current user not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Failed to fetch invites
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */


export async function GET() {
    await requireLoggedInUser();

    try {
        const session = await getServerSession(authOptions);

        if (!session?.user?.id) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const currentUser = await prisma.user.findUnique({
            where: { id: session.user.id },
            select: {
                id: true,
                archeryGBNumber: true
            }
        });

        if (!currentUser) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        const whereConditions = {
            status: "PENDING" as const,
            OR: [
                { userId: currentUser.id },
                ...(currentUser.archeryGBNumber ? [ { archeryGBNumber: currentUser.archeryGBNumber } ] : [])
            ]
        };

        const invites = await prisma.invite.findMany({
            where: whereConditions,
            include: {
                club: {
                    select: {
                        id: true,
                        name: true,
                    }
                },
                inviter: {
                    select: {
                        name: true,
                    }
                }
            },
            orderBy: {
                createdAt: "desc"
            }
        });

        return NextResponse.json({ invites });

    } catch (error) {
        console.error("Error fetching user invites:", error);
        return NextResponse.json(
            { error: "Failed to fetch invites" },
            { status: 500 }
        );
    }
}