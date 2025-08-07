import { NextRequest, NextResponse } from "next/server";
import prisma from "@/app/lib/prisma";
import { requireLoggedInUser } from "@/app/lib/server-utils";

export async function GET(request: NextRequest, context: any) {
    await requireLoggedInUser();
    
    const params = await context.params;
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

export async function DELETE(request: Request, context: any) {
    const clubId = context.params.id;

    if (!clubId) {
        return NextResponse.json({ error: "Missing club id" }, { status: 400 });
    }

    try {
        await prisma.clubMembership.deleteMany({ where: { clubId } });
        await prisma.club.delete({ where: { id: clubId } });
        return NextResponse.json({ message: "Club deleted" }, { status: 200 });
    } catch (error) {
        console.error('Error deleting club:', error);
        return NextResponse.json({ error: "Failed to delete club" }, { status: 500 });
    }
}
