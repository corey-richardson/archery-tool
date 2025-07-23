import { NextRequest, NextResponse } from "next/server";
import prisma from "@/app/lib/prisma";

export async function DELETE(request: NextRequest, context: any) {
    const params = await context.params;
    const scoreId = params.id;

    if (!scoreId) {
        return NextResponse.json({error: "Missing scoreId"}, {status: 400});
    }

    await prisma.scores.delete({
        where: { id: scoreId },
    });

    return NextResponse.json({ message: "Score deleted." });
}
