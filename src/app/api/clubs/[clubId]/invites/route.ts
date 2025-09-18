import { NextRequest, NextResponse } from "next/server";
import prisma from "@/app/lib/prisma";
import { requireLoggedInUser, requireAdminUser } from "@/app/lib/server-utils";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/authOptions";

/**
 * @swagger
 * /api/clubs/{clubId}/invites:
 *   post:
 *     operationId: createClubInvite
 *     tags:
 *       - Invites
 *     summary: Create an invite to a club
 *     description: Creates a pending invite for a user to join the specified club using their Archery GB number
 *     parameters:
 *       - in: path
 *         name: clubId
 *         required: true
 *         schema:
 *           type: string
 *         description: The unique identifier of the club
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - archeryGBNumber
 *               - invitedBy
 *             properties:
 *               archeryGBNumber:
 *                 type: string
 *                 description: Archery GB number of the user to invite
 *               invitedBy:
 *                 type: string
 *                 description: ID of the user sending the invite
 *     responses:
 *       201:
 *         description: Invite created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Invite'
 *       400:
 *         description: Missing required fields
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       409:
 *         description: Invite already exists or user is already a member
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *   get:
 *     operationId: listClubInvites
 *     tags:
 *       - Invites
 *     summary: Get pending invites for a club
 *     description: Returns all pending invites for the specified club (admin only)
 *     parameters:
 *       - in: path
 *         name: clubId
 *         required: true
 *         schema:
 *           type: string
 *         description: The unique identifier of the club
 *     responses:
 *       200:
 *         description: List of pending invites
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
 *       403:
 *         description: Not authorised (admin only)
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */

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