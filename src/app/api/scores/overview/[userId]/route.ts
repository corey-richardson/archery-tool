import { NextRequest, NextResponse } from "next/server";
import prisma from "@/app/lib/prisma";
import { requireLoggedInUser, requireRecordsUserOrHigher } from "@/app/lib/server-utils";

export async function GET(request: NextRequest, context: any) {
    await requireLoggedInUser();

    const { userId } = await context.params;

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
