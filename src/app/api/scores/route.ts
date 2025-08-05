import { NextRequest, NextResponse } from "next/server";
import prisma from "@/app/lib/prisma";

export async function POST(request: NextRequest) {
    const body = await request.json();
    const { userId, sex, ageCategory, submittedAt, dateShot, roundName, roundType, bowstyle, score, xs, tens, nines, hits, competitionLevel, notes } = body;

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
