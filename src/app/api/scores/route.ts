import { NextRequest, NextResponse } from "next/server";
import prisma from "@/app/lib/prisma";
import { requireLoggedInUser } from "@/app/lib/server-utils";

export async function POST(request: NextRequest) {
    const user = await requireLoggedInUser();

    const body = await request.json();
    const { userId, sex, ageCategory, submittedAt, dateShot, roundName, roundType, bowstyle, score, xs, tens, nines, hits, competitionLevel, notes } = body;

    if (user.id != userId) {
        return NextResponse.json({error: "A mismatch between 'id' parameters was detected."}, { status: 403 });
    }

    if (!userId || !dateShot || !roundName || !roundType || !bowstyle || !competitionLevel) {
        return NextResponse.json({error: "Missing required fields"}, { status: 400 });
    }

    const newScoreRecord = await prisma.scores.create({
        data: {
            userId,
            sex,
            ageCategory,
            submittedAt,
            dateShot,
            roundName,
            roundType,
            bowstyle,
            score: parseInt(score),
            xs: parseInt(xs),
            tens: parseInt(tens),
            nines: parseInt(nines),
            hits: parseInt(hits),
            competitionLevel,
            notes,
        },
    });

    return NextResponse.json(newScoreRecord, { status: 201 });
}
