import { NextRequest, NextResponse } from "next/server";
import prisma from "@/app/lib/prisma";
import { requireLoggedInUser, requireRecordsUserOrHigher } from "@/app/lib/server-utils";

/**
 * @swagger
 * /api/scores/{scoreId}:
 *   patch:
 *     operationId: updateScore
 *     tags:
 *       - Scores
 *     summary: Update a score
 *     description: >
 *       Updates a score with the provided fields.
 *       Requires a user with RECORDS role or higher.
 *     parameters:
 *       - in: path
 *         name: scoreId
 *         required: true
 *         schema:
 *           type: string
 *         description: The unique identifier of the score
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               ageCategory: { type: "string" }
 *               roundIndoorClassification: { type: "string" }
 *               roundOutdoorClassification: { type: "string" }
 *               roundHandicap: { type: "number" }
 *               notes: { type: "string" }
 *               sex: { type: "string" }
 *               dateShot: { type: "string", format: "date" }
 *               roundName: { type: "string" }
 *               roundType: { type: "string" }
 *               bowstyle: { type: "string" }
 *               score: { type: "integer" }
 *               xs: { type: "integer" }
 *               tens: { type: "integer" }
 *               nines: { type: "integer" }
 *               hits: { type: "integer" }
 *               competitionLevel: { type: "string" }
 *               processedAt: { type: "string", format: "date-time" }
 *     responses:
 *       200:
 *         description: Score updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message: { type: "string" }
 *                 score:
 *                   $ref: '#/components/schemas/Score'
 *       400:
 *         description: Missing scoreId or no fields provided
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       404:
 *         description: Score not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Failed to update score
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *     security:
 *       - SessionAuth: []
 *
 *   delete:
 *     operationId: deleteScore
 *     tags:
 *       - Scores
 *     summary: Delete a score
 *     description: Deletes the specified score
 *     parameters:
 *       - in: path
 *         name: scoreId
 *         required: true
 *         schema:
 *           type: string
 *         description: The unique identifier of the score
 *     responses:
 *       200:
 *         description: Score deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message: { type: "string", example: "Score deleted." }
 *       400:
 *         description: Missing scoreId
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *     security:
 *       - SessionAuth: []
 */

export async function PATCH(
    request: NextRequest,
    { params }: { params: { scoreId: string } }
) {
    await requireRecordsUserOrHigher();

    try {
        const { scoreId } = await params;
        const body = await request.json();

        if (!scoreId) {
            return NextResponse.json({ error: "Missing scoreId" }, { status: 400 });
        }

        // Validate that at least one field is provided
        const {
            ageCategory,
            roundIndoorClassification,
            roundOutdoorClassification,
            roundHandicap,
            notes,
            processedAt,
            // Allow other score fields to be updated as well
            sex,
            dateShot,
            roundName,
            roundType,
            bowstyle,
            score,
            xs,
            tens,
            nines,
            hits,
            competitionLevel
        } = body;

        const hasUpdates = Object.keys(body).length > 0;
        if (!hasUpdates) {
            return NextResponse.json({ error: "No fields provided to update" }, { status: 400 });
        }

        // Build the update data object dynamically
        const updateData: any = {};

        // Handle classification updates (requires special logic)
        if (roundIndoorClassification !== undefined) {
            updateData.roundIndoorClassification = roundIndoorClassification;
        }
        if (roundOutdoorClassification !== undefined) {
            updateData.roundOutdoorClassification = roundOutdoorClassification;
        }

        // Handle other simple field updates
        if (ageCategory !== undefined) updateData.ageCategory = ageCategory;
        if (roundHandicap !== undefined) updateData.roundHandicap = roundHandicap;
        if (notes !== undefined) updateData.notes = notes;
        if (sex !== undefined) updateData.sex = sex;
        if (dateShot !== undefined) updateData.dateShot = dateShot;
        if (roundName !== undefined) updateData.roundName = roundName;
        if (roundType !== undefined) updateData.roundType = roundType;
        if (bowstyle !== undefined) updateData.bowstyle = bowstyle;
        if (score !== undefined) updateData.score = parseInt(score);
        if (xs !== undefined) updateData.xs = parseInt(xs);
        if (tens !== undefined) updateData.tens = parseInt(tens);
        if (nines !== undefined) updateData.nines = parseInt(nines);
        if (hits !== undefined) updateData.hits = parseInt(hits);
        if (competitionLevel !== undefined) updateData.competitionLevel = competitionLevel;

        // Handle processedAt field (convert to Date if provided)
        if (processedAt !== undefined) {
            updateData.processedAt = processedAt ? new Date(processedAt) : processedAt;
        }

        // Verify the score exists before updating
        const existingScore = await prisma.scores.findUnique({
            where: { id: scoreId }
        });

        if (!existingScore) {
            return NextResponse.json({ error: "Score not found" }, { status: 404 });
        }

        // Perform the update
        const updatedScore = await prisma.scores.update({
            where: { id: scoreId },
            data: updateData,
        });

        return NextResponse.json({
            message: "Score updated successfully",
            score: updatedScore
        });

    } catch (error) {
        console.error("Failed to update score:", error);
        return NextResponse.json({
            error: "Failed to update score",
            details: error instanceof Error ? error.message : "Unknown error"
        }, { status: 500 });
    }
}

export async function DELETE(request: NextRequest, context: any) {
    await requireLoggedInUser();

    const params = await context.params;
    const scoreId = params.scoreId;

    if (!scoreId) {
        return NextResponse.json({error: "Missing scoreId"}, {status: 400});
    }

    await prisma.scores.delete({
        where: { id: scoreId },
    });

    return NextResponse.json({ message: "Score deleted." });
}
