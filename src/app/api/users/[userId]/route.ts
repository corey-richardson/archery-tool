import { NextRequest, NextResponse } from "next/server";
import prisma from "@/app/lib/prisma";
import { requireLoggedInUser } from "@/app/lib/server-utils";

interface Membership {
    roles: string[];
}

/**
 * @swagger
 * /api/users/{userId}:
 *   get:
 *     tags:
 *       - Users
 *     summary: Get a user by ID
 *     description: Retrieves the details of a specific user. Only the user themselves or a user with RECORDS or higher privileges can access this endpoint.
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the user to retrieve
 *     responses:
 *       200:
 *         description: User details retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       400:
 *         description: Missing required userId parameter
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       403:
 *         description: Unauthorized access
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       404:
 *         description: User not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *
 *   patch:
 *     tags:
 *       - Users
 *     summary: Update a user
 *     description: Updates the fields of a user. Only the user themselves or a user with RECORDS or higher privileges can update.
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the user to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: The user's name
 *               email:
 *                 type: string
 *                 description: The user's email address
 *               archeryGBNumber:
 *                 type: string
 *                 nullable: true
 *                 description: The user's ArcheryGB number
 *               sex:
 *                 type: string
 *                 nullable: true
 *               gender:
 *                 type: string
 *                 nullable: true
 *               yearOfBirth:
 *                 type: integer
 *                 nullable: true
 *               defaultBowstyle:
 *                 type: string
 *                 nullable: true
 *             example:
 *               name: "Jane Doe"
 *               email: "jane@example.com"
 *               archeryGBNumber: "123456"
 *               sex: "F"
 *               gender: "Female"
 *               yearOfBirth: 1990
 *               defaultBowstyle: "Recurve"
 *     responses:
 *       200:
 *         description: User updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 user:
 *                   $ref: '#/components/schemas/User'
 *       400:
 *         description: Missing required fields
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       403:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       409:
 *         description: Conflict with existing email or ArcheryGB number
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */


export async function GET(req: NextRequest, context: any) {
    const requestor = await requireLoggedInUser();

    const params = await context.params;
    const userId = params.userId;

    const isRecordsOrHigher = requestor.memberships.some((membership: Membership) =>
        membership.roles.includes("ADMIN") || membership.roles.includes("CAPTAIN") || membership.roles.includes("RECORDS")
    );

    if (!isRecordsOrHigher && requestor.id !== userId) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    if (!userId) {
        return NextResponse.json({ error: "Missing userId"}, { status: 400 });
    }

    const user = await prisma.user.findUnique({
        where: { id: userId },
    });

    if (!user) {
        return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json(user, { status: 200 });
}


export async function PATCH(req: Request) {
    const requestor = await requireLoggedInUser();

    const body = await req.json();
    const { id, ...updateData } = body;

    const isRecordsOrHigher = requestor.memberships.some((membership: Membership) =>
        membership.roles.includes("ADMIN") || membership.roles.includes("CAPTAIN") || membership.roles.includes("RECORDS")
    );

    if (!isRecordsOrHigher && requestor.id !== id) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    if (!id) {
        return NextResponse.json({message: "Missing user ID."}, { status: 400});
    }

    // Build the data object with only the fields that were provided
    const dataToUpdate: any = {
        updatedAt: new Date(),
    };

    // Only include fields that are actually provided in the request
    if (updateData.name !== undefined) dataToUpdate.name = updateData.name;
    if (updateData.email !== undefined) dataToUpdate.email = updateData.email;
    if (updateData.archeryGBNumber !== undefined) dataToUpdate.archeryGBNumber = updateData.archeryGBNumber || null;
    if (updateData.sex !== undefined) dataToUpdate.sex = updateData.sex || null;
    if (updateData.gender !== undefined) dataToUpdate.gender = updateData.gender || null;
    if (updateData.yearOfBirth !== undefined) dataToUpdate.yearOfBirth = updateData.yearOfBirth || null;
    if (updateData.defaultBowstyle !== undefined) dataToUpdate.defaultBowstyle = updateData.defaultBowstyle || null;

    // Validation only for fields being updated
    if (dataToUpdate.name !== undefined && (!dataToUpdate.name || dataToUpdate.name.trim() === "")) {
        return NextResponse.json({error: "Name cannot be empty."}, { status: 400});
    }

    if (dataToUpdate.email !== undefined && (!dataToUpdate.email || dataToUpdate.email.trim() === "")) {
        return NextResponse.json({error: "Email cannot be empty."}, { status: 400});
    }

    // Check email uniqueness only if email is being updated
    if (dataToUpdate.email !== undefined) {
        const existingEmail = await prisma.user.findFirst({
            where: {
                email: dataToUpdate.email,
                NOT: { id },
            },
        });
        if (existingEmail) {
            return NextResponse.json({ error: "Email is already in use." }, { status: 409 });
        }
    }

    // Check ArcheryGB number uniqueness only if it's being updated
    if (dataToUpdate.archeryGBNumber !== undefined && dataToUpdate.archeryGBNumber) {
        const existingAGB = await prisma.user.findFirst({
            where: {
                archeryGBNumber: dataToUpdate.archeryGBNumber,
                NOT: { id },
            },
        });

        if (existingAGB) {
            return NextResponse.json({ error: "That ArcheryGB Number is already associated with a user." }, { status: 409 });
        }

        try {
            await prisma.invite.updateMany({
                where: {
                    archeryGBNumber: dataToUpdate.archeryGBNumber,
                    userId: null,
                    status: "PENDING"
                },
                data: {
                    userId: id
                }
            });
        } catch (_error) {
            console.error("Error linking invites to user:", _error);
        }
    }

    const updatedUser = await prisma.user.update({
        where: {
            id,
        },
        data: dataToUpdate
    });

    return NextResponse.json({ message: "User updated successfully.", user: updatedUser }, { status: 200 });
}
