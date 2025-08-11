import { NextRequest, NextResponse } from "next/server";
import prisma from "@/app/lib/prisma";
import { requireLoggedInUser } from "@/app/lib/server-utils";

interface Membership {
    roles: string[];
}

export async function GET(req: NextRequest, context: any) {
    const requestor = await requireLoggedInUser();

    const params = await context.params;
    const userId = params.userId;

    const isRecordsOrAdmin = requestor.memberships.some((membership: Membership) =>
        membership.roles.includes("ADMIN") || membership.roles.includes("RECORDS")
    );

    if (!isRecordsOrAdmin && requestor.id !== userId) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    if (!userId) {
        return NextResponse.json({ error: "Missing userId"}, { status: 400 });
    }

    const user = await prisma.user.findUnique({
        where: { id: userId },
    });

    if (!user) {
        return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json(user, { status: 200 });
}
