import { NextRequest, NextResponse } from "next/server";
import prisma from "@/app/lib/prisma";

export async function GET(request: NextRequest) {
    const userId = request.nextUrl.searchParams.get("userId");

    if (!userId) {
        return NextResponse.json({ error: "Missing userId"}, { status: 400 });
    }

    const emergencyContacts = await prisma.iceDetails.findMany({
        where: { userId }
    });

    return NextResponse.json(emergencyContacts);
}
