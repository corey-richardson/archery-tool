import { NextRequest, NextResponse } from "next/server";
import prisma from "@/app/lib/prisma";
import { requireLoggedInUser, requireRecordsUserOrHigher } from "@/app/lib/server-utils";

/**
 * @swagger
 * /api/users/{userId}/scores/overview:
 *   get:
 *     operationId: getUserScoresOverview
 *     tags:
 *       - Records Summary
 *     summary: Retrieve a user's score overview
 *     description: >
 *       Retrieves the `recordsSummary` overview for a specific user.
 *       If no overview exists, a new one will be created.
 *       Requires the user to be logged in.
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the user
 *     responses:
 *       200:
 *         description: Existing overview retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/RecordsSummary'
 *       201:
 *         description: Overview created as it did not exist
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/RecordsSummary'
 *       400:
 *         description: Missing or invalid userId
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *   patch:
 *     operationId: updateUserScoresOverview
 *     tags:
 *       - Records Summary
 *     summary: Update a field in a user's score overview
 *     description: >
 *       Updates a specific field in the `recordsSummary` for a user.
 *       Requires a user with RECORDS or higher roles.
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the user
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               field:
 *                 type: string
 *                 description: The field name to update
 *               value:
 *                 type: string
 *                 description: The value to set for the field
 *             required:
 *               - field
 *     responses:
 *       200:
 *         description: Overview updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/RecordsSummary'
 *       400:
 *         description: Missing required field or invalid JSON
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Failed to update overview
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *     security:
 *       - SessionAuth: []
 */

export async function GET(request: NextRequest, context: any) {
    await requireLoggedInUser();

    const p = await context.params;
    const userId = p.userId;

    if (!userId) {
        return NextResponse.json({ error: "Missing userId" }, { status: 400 });
    }

    const overview = await prisma.recordsSummary.findUnique({
        where: { userId: userId },
    });

    if (!overview) {
        // return NextResponse.json({ error: "Overview not found" }, { status: 404 });

        const overview = await prisma.recordsSummary.create({
            data: {
                userId,
            },
        });

        return NextResponse.json(overview, { status: 201 });
    }

    return NextResponse.json(overview, { status: 200 });
}

export async function PATCH(request: NextRequest, context: any) {
    await requireRecordsUserOrHigher();

    const { userId } = await context.params;

    if (!userId) {
        return NextResponse.json({ error: "Missing userId" }, { status: 400 });
    }

    let body: { field?: string, value?: any };
    try {
        body = await request.json();
    } catch (error) {
        return NextResponse.json({ error: "Invalid JSON request: " + error }, { status: 400 });
    }

    const { field, value } = body;
    if (!field) {
        return NextResponse.json({ error: "Missing required field." }, { status: 400 });
    }

    try {
        const updatedOverview = await prisma.recordsSummary.update({
            where: { userId, },
            data: { [field]: value, },
        });
        return NextResponse.json(updatedOverview, { status: 200 });
    } catch (error) {
        return NextResponse.json({ error: "Failed to update record overview: " + error}, { status: 500 });
    }
}
