import { NextRequest, NextResponse } from "next/server";
import prisma from "@/app/lib/prisma";

export async function GET(request: NextRequest, context: any) {
    const params = context.params;
    const clubId = params.id;

    if (!clubId) {
        return NextResponse.json({ error: "Missing clubId"}, { status: 400 });
    }

    const [ club, members ] = await Promise.all([
        prisma.club.findUnique({ where: { id: clubId }, }),
        prisma.clubMembership.findMany({ 
            where: { clubId }, 
            include: { user: true, }
        }),
    ]);

    if (!club || !members) { 
        return NextResponse.json({ error: "Failed to fetch Club " + clubId}, { status: 404 });
    }

    return NextResponse.json({ club, members }, { status: 200 });
}
