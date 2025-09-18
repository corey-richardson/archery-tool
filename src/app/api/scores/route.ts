import { NextRequest, NextResponse } from "next/server";
import prisma from "@/app/lib/prisma";
import { requireLoggedInUser } from "@/app/lib/server-utils";

/**
 * @swagger
 * /api/scores:
 *   post:
 *     operationId: createScore
 *     tags:
 *       - Scores
 *     summary: Create a new score record
 *     description: >
 *       Creates a new score for the logged-in user.
 *       The `userId` in the request body must match the authenticated user's ID.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               userId:
 *                 type: string
 *               sex:
 *                 type: string
 *                 nullable: true
 *               ageCategory:
 *                 type: string
 *                 nullable: true
 *               submittedAt:
 *                 type: string
 *                 format: date-time
 *                 nullable: true
 *               dateShot:
 *                 type: string
 *                 format: date
 *               roundName:
 *                 type: string
 *               roundType:
 *                 type: string
 *               bowstyle:
 *                 type: string
 *               score:
 *                 type: integer
 *                 nullable: true
 *               xs:
 *                 type: integer
 *                 nullable: true
 *               tens:
 *                 type: integer
 *                 nullable: true
 *               nines:
 *                 type: integer
 *                 nullable: true
 *               hits:
 *                 type: integer
 *                 nullable: true
 *               competitionLevel:
 *                 type: string
 *               notes:
 *                 type: string
 *                 nullable: true
 *             required:
 *               - userId
 *               - dateShot
 *               - roundName
 *               - roundType
 *               - bowstyle
 *               - competitionLevel
 *     responses:
 *       201:
 *         description: Score created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Score'
 *       400:
 *         description: Missing required fields
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       403:
 *         description: User ID mismatch
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *     security:
 *       - SessionAuth: []
 */

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
