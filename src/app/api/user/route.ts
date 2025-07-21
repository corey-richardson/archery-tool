import { NextRequest, NextResponse } from "next/server";
import prisma from "@/app/lib/prisma";

export async function GET(req: NextRequest) {
    const userId = req.nextUrl.searchParams.get("userId");

    console.log(userId);

    if (!userId) {
        return NextResponse.json({ error: "Missing userId"}, { status: 400 });
    }

    const user = await prisma.user.findUnique({
        where: { id: userId },
    });

    console.log(user);

    return NextResponse.json(user);
}
