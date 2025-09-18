import { NextResponse } from "next/server";
import prisma from "@/app/lib/prisma";
import { requireLoggedInUser } from "@/app/lib/server-utils";

/**
 * @swagger
 * /api/users/{userId}/clubs:
 *   get:
 *     operationId: listUserClubs
 *     tags:
 *       - Users
 *     summary: List all active clubs for a user
 *     description: >
 *       Retrieves all clubs that the specified user is a member of, along with membership details
 *       and a list of users in the club with ADMIN, CAPTAIN, or RECORDS roles.
 *       Requires a logged-in user.
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         description: The unique identifier of the user
 *     responses:
 *       200:
 *         description: List of clubs with membership details
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 clubs:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: string
 *                       name:
 *                         type: string
 *                       createdAt:
 *                         type: string
 *                         format: date-time
 *                       updatedAt:
 *                         type: string
 *                         format: date-time
 *                       membershipDetails:
 *                         $ref: '#/components/schemas/ClubMembership'
 *                       adminOrRecordsUsers:
 *                         type: array
 *                         items:
 *                           type: object
 *                           properties:
 *                             id:
 *                               type: string
 *                             name:
 *                               type: string
 *                             highestRole:
 *                               type: string
 *                               enum: [ADMIN, CAPTAIN, RECORDS, ?]
 *       400:
 *         description: Missing userId
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Failed to fetch clubs
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *     security:
 *       - SessionAuth: []
 */

export async function GET(request: Request, context: any) {
    await requireLoggedInUser();

    const p = await context.params;
    const userId = p.userId;

    if (!userId) {
        return NextResponse.json({ error: "Missing userId" }, { status: 400 });
    }

    try {
        const userClubs = await prisma.clubMembership.findMany({
            where: {
                userId: userId,
                endedAt: null,
            },
            include: {
                club: true,
                user: true,
            },
        });

        // Sort function
        const getRolePriority = (roles: string[]) => {
            if (roles.includes("ADMIN")) return 1;
            if (roles.includes("CAPTAIN")) return 2;
            if (roles.includes("RECORDS")) return 3;
            if (roles.includes("COACH")) return 4;
            if (roles.includes("MEMBER")) return 5;
            return 5;
        };

        const clubs = await Promise.all(
            userClubs.map(async membership => {
                // Fetch users with ADMIN, CAPTAIN or RECORDS roles for this club
                const adminOrRecordsUsers = await prisma.clubMembership.findMany({
                    where: {
                        clubId: membership.club.id,
                        endedAt: null,
                        OR: [
                            { roles: { has: "ADMIN" } },
                            { roles: { has: "CAPTAIN" } },
                            { roles: { has: "RECORDS" } }
                        ]
                    },
                    include: {
                        user: true
                    }
                });

                return {
                    ...membership.club,
                    membershipDetails: {
                        roles: membership.roles,
                        joinedAt: membership.joinedAt,
                        membershipId: membership.id,
                    },
                    adminOrRecordsUsers: adminOrRecordsUsers.map(u => ({
                        id: u.user.id,
                        name: u.user.name,
                        highestRole: u.roles.includes("ADMIN")
                            ? "ADMIN"
                            : u.roles.includes("CAPTAIN")
                                ? "CAPTAIN"
                                : u.roles.includes("RECORDS")
                                    ? "RECORDS"
                                    : "?"
                    })),
                    _rolePriority: getRolePriority(membership.roles),
                };
            })
        );

        const sortedClubs = clubs
            .sort((a, b) => a._rolePriority - b._rolePriority)
            .map(({ _rolePriority, ...club }) => club);

        return NextResponse.json({ clubs: sortedClubs }, { status: 200 });

    } catch (error) {
        console.error("Error fetching user clubs:", error);
        return NextResponse.json({ error: "Failed to fetch clubs" }, { status: 500 });
    }
}
