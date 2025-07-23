import { NextRequest, NextResponse } from "next/server";
import prisma from "@/app/lib/prisma";

export async function GET(request: NextRequest, context: any) {
    const params = await context.params;
    const userId = params.userId;

    if (!userId) {
        return NextResponse.json({ error: "Missing userId"}, { status: 400 });
    }

    const usersScores = await prisma.scores.findMany({
        where: { userId },
        orderBy: [{ dateShot: "desc" }, { submittedAt: "desc" }]
    })

    return NextResponse.json(usersScores);
}
