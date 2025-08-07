import { NextRequest, NextResponse } from "next/server";
import prisma from "@/app/lib/prisma";
import { requireLoggedInUser } from "@/app/lib/server-utils";

export async function GET(request: NextRequest, context: any) {
    await requireLoggedInUser();
    
    const params = await context.params;
    const userId = params.userId;

    if (!userId) {
        return NextResponse.json({ error: "Missing userId" }, { status: 400 });
    }

    const overview = await prisma.recordsSummary.findUnique({
        where: { userId: userId },
    });

    if (!overview) {
        return NextResponse.json({ error: "Overview not found" }, { status: 404 });
    }

    return NextResponse.json(overview, { status: 201 });
}
