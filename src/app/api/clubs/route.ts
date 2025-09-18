import { NextResponse } from "next/server";
import prisma from "@/app/lib/prisma";
import { requireLoggedInUser } from "@/app/lib/server-utils";

/**
 * @swagger
 * /api/clubs:
 *   post:
 *     operationId: createClub
 *     tags:
 *       - Clubs
 *     summary: Create a new club
 *     description: >
 *       Creates a new club and assigns the creator as both a MEMBER and ADMIN.
 *       Requires a logged-in user.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - clubName
 *               - creatorId
 *             properties:
 *               clubName:
 *                 type: string
 *                 example: My New Archery Club
 *               creatorId:
 *                 type: string
 *                 description: ID of the user creating the club
 *     responses:
 *       201:
 *         description: Club created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 createdClub:
 *                   $ref: '#/components/schemas/Club'
 *       400:
 *         description: Missing club name
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       409:
 *         description: A club with that name already exists
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Failed to create club
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *     security:
 *       - SessionAuth: []
 */

export async function POST (req: Request) {
    await requireLoggedInUser();

    const { clubName, creatorId } = await req.json();

    if (!clubName) {
        return NextResponse.json({ message: "Missing Club Name" }, { status: 400 });
    }

    const existingclub = await prisma.club.findUnique({ where: { name: clubName }});
    if (existingclub) { return NextResponse.json({ message: "A club with that name already exists" }, { status: 409 }); }

    const createdClub = await prisma.club.create({
        data: {
            name: clubName,
        }
    });

    if (!createdClub) return NextResponse.json({ error: "Failed to create club." }, { status: 500 });

    await prisma.clubMembership.create({
        data: {
            userId: creatorId,
            clubId: createdClub.id,
            roles: [ "MEMBER", "ADMIN", ],
        }
    })

    return NextResponse.json({ createdClub }, { status: 201 });
}
