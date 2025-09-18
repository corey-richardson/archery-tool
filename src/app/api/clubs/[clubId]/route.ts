import { NextRequest, NextResponse } from "next/server";
import prisma from "@/app/lib/prisma";
import { requireAdminUser, requireLoggedInUser } from "@/app/lib/server-utils";

/**
 * @swagger
 * /api/clubs/{clubId}:
 *   get:
 *     operationId: getClubDetails
 *     tags:
 *       - Clubs
 *     summary: Get club details and members
 *     description: >
 *       Fetches information about a club and its current memberships.
 *       Requires a logged-in user.
 *     parameters:
 *       - in: path
 *         name: clubId
 *         required: true
 *         schema:
 *           type: string
 *         description: The unique identifier of the club
 *     responses:
 *       200:
 *         description: Club and members retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 club:
 *                   $ref: '#/components/schemas/Club'
 *                 members:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/ClubMembership'
 *       400:
 *         description: Missing clubId
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       404:
 *         description: Club or members not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Server error while fetching club
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *     security:
 *       - SessionAuth: []
 *
 *   delete:
 *     operationId: deleteClub
 *     tags:
 *       - Clubs
 *     summary: Delete a club
 *     description: >
 *       Deletes a club and all its memberships.
 *       Requires an admin user.
 *     parameters:
 *       - in: path
 *         name: clubId
 *         required: true
 *         schema:
 *           type: string
 *         description: The unique identifier of the club
 *     responses:
 *       200:
 *         description: Club deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Club deleted
 *       400:
 *         description: Missing clubId
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Failed to delete club
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *     security:
 *       - SessionAuth: []
 */

export async function GET(request: NextRequest, context: any) {
    await requireLoggedInUser();

    const params = await context.params;
    const clubId = params.clubId;

    if (!clubId) {
        return NextResponse.json({ error: "Missing clubId"}, { status: 400 });
    }

    const [ club, members ] = await Promise.all([
        prisma.club.findUnique({ where: { id: clubId }, }),
        prisma.clubMembership.findMany({
            where: { clubId },
            include: { user: true, }
        }),
    ]);

    if (!club || !members) {
        return NextResponse.json({ error: "Failed to fetch Club " + clubId}, { status: 404 });
    }

    return NextResponse.json({ club, members }, { status: 200 });
}

export async function DELETE(request: Request, context: any) {
    await requireAdminUser();

    const p = await context.params;
    const clubId = p.clubId;

    if (!clubId) {
        return NextResponse.json({ error: "Missing club id" }, { status: 400 });
    }

    try {
        await prisma.clubMembership.deleteMany({ where: { clubId } });
        await prisma.club.delete({ where: { id: clubId } });
        return NextResponse.json({ message: "Club deleted" }, { status: 200 });
    } catch (error) {
        console.error("Error deleting club:", error);
        return NextResponse.json({ error: "Failed to delete club" }, { status: 500 });
    }
}
