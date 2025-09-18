import { NextRequest, NextResponse } from "next/server";
import prisma from "@/app/lib/prisma";
import { requireAdminUser } from "@/app/lib/server-utils";

/**
 * @swagger
 * /api/users/{userId}/clubs/{clubId}/roles:
 *   put:
 *     operationId: updateUserRoles
 *     tags:
 *       - Club Memberships
 *     summary: Update roles of a user in a club
 *     description: >
 *       Updates the roles assigned to a specific user within a club.
 *       Only Admin users can perform this action.
 *       Cannot remove the last Admin from a club.
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the user whose roles are being updated
 *       - in: path
 *         name: clubId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the club
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               roles:
 *                 type: array
 *                 items:
 *                   type: string
 *                 description: Array of roles to assign to the user
 *             required:
 *               - roles
 *     responses:
 *       200:
 *         description: Roles updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *       400:
 *         description: Attempted to remove last admin or invalid request
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       401:
 *         description: User is not an Admin
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       404:
 *         description: Membership not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Failed to update roles
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *     security:
 *       - SessionAuth: []
 */

export async function PUT(req: NextRequest) {
    try {
        await requireAdminUser();
    } catch {
        return NextResponse.json({ error: "Only Admin users can update roles." }, { status: 401 });
    }

    const url = req.nextUrl.pathname;
    const [ , , , userId, , clubId ] = url.split("/"); // ['', 'api', 'users', userId, clubs, clubId, 'roles']

    const { roles } = await req.json();

    try {
        const existingMemberships = await prisma.clubMembership.findFirst({
            where: {
                userId,
                clubId,
                endedAt: null,
            },
        });

        const isRemovingAdmin = existingMemberships?.roles.includes("ADMIN") && !roles.includes("ADMIN");

        if (isRemovingAdmin) {
            const adminCount = await prisma.clubMembership.count({
                where: {
                    clubId,
                    roles: {  has: "ADMIN" },
                    NOT: {userId },
                }
            });

            if (adminCount == 0) {
                return NextResponse.json({ error: "Cannot remove the last admin from the club." }, { status: 400 });
            }
        }

        if (!existingMemberships) {
            return NextResponse.json({ error: "Membership not found." }, { status: 404 });
        }

        await prisma.clubMembership.update({
            where: {
                id: existingMemberships.id
            },
            data: { roles },
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Update failed:", error);
        return NextResponse.json({ error: "Failed to update roles" }, { status: 500 });
    }
}
