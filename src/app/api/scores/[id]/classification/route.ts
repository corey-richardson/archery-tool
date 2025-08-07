import { NextRequest, NextResponse } from "next/server";
import prisma from "@/app/lib/prisma";
import { requireRecordsUserOrHigher } from "@/app/lib/server-utils";

interface Params {
  params: { id: string };
}

export async function PUT(request: NextRequest, { params }: Params) {
    await requireRecordsUserOrHigher();
    
    try {
        const scoreId = params.id;
        const body = await request.json();
        const { roundType, roundClassification } = body;

        if (!scoreId || !roundType || !roundClassification) {
            console.error("Missing required fields.");
            return NextResponse.json({message: "Missing required fields."}, { status: 400});
        }

        let updatedScore = null;
        if (roundType === "INDOOR") {
            updatedScore = await prisma.scores.update({
                where: { id: scoreId },
                data: { roundIndoorClassification: roundClassification },
            });
        } else if (roundType === "OUTDOOR") {
            updatedScore = await prisma.scores.update({
                where: { id: scoreId },
                data: { roundOutdoorClassification: roundClassification },
            });
        } else {
            console.error("Round Type was not of expected type.");
            return NextResponse.json({message: "Round Type was not of expected type."}, { status: 400});
        }

        return NextResponse.json(updatedScore);
    } catch (error) {
        console.error('Failed to update roundClassification:', error);
        return NextResponse.json({ error: 'Failed to update classification' }, { status: 500 });
    }
}
