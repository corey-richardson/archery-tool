import { NextRequest, NextResponse } from "next/server";
import prisma from "@/app/lib/prisma";
import { requireAdminUser } from "@/app/lib/server-utils";

export async function GET(request: NextRequest, context: any) {
    await requireAdminUser();

    const params = await context.params;
    const userId = params.userId;

    if (!userId) {
        return NextResponse.json({ error: "Missing userId" }, { status: 400 });
    }

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1", 10);
    const pageSize = parseInt(searchParams.get("pageSize") || "10", 10);
    const skip = (page - 1) * pageSize;
    const take = pageSize;

    const [scores, total] = await Promise.all([
        prisma.scores.findMany({
            where: { userId },
            orderBy: [{ dateShot: "desc" }, { submittedAt: "desc" }],
            skip,
            take,
        }),
        prisma.scores.count({ where: { userId } })
    ]);

    const hasMore = skip + scores.length < total;
    const totalPages = Math.ceil(total / pageSize);

    return NextResponse.json({ scores, hasMore, totalPages }, { status: 200 });
}
