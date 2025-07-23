import { NextRequest, NextResponse } from "next/server";
import prisma from "@/app/lib/prisma";

export async function GET(req: NextRequest, context: any) {
    const params = await context.params;
    const userId = params.userId;

    console.log(userId || "nope");

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
