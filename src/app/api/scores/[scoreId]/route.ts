import { NextRequest, NextResponse } from "next/server";
import prisma from "@/app/lib/prisma";
import { requireLoggedInUser, requireRecordsUserOrHigher } from "@/app/lib/server-utils";

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
