import { NextRequest, NextResponse } from "next/server";
import prisma from "@/app/lib/prisma";
import { requireLoggedInUser } from "@/app/lib/server-utils";

/**
 * @swagger
 * /api/scores/user/{userId}:
 *   get:
 *     operationId: listUserScores
 *     tags:
 *       - Scores
 *     summary: List scores for a specific user
 *     description: >
 *       Retrieves a paginated list of scores for the specified user.
 *       Requires a logged-in user.
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         description: The unique identifier of the user
 *       - in: query
 *         name: page
 *         required: false
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Page number for pagination
 *       - in: query
 *         name: pageSize
 *         required: false
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Number of scores per page
 *     responses:
 *       200:
 *         description: Paginated list of scores
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 scores:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Score'
 *                 hasMore:
 *                   type: boolean
 *                   description: Indicates if there are more pages available
 *                 totalPages:
 *                   type: integer
 *                   description: Total number of pages
 *       400:
 *         description: Missing or invalid userId
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *     security:
 *       - SessionAuth: []
 */

export async function GET(request: NextRequest, context: any) {
    await requireLoggedInUser();

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

    const [ scores, total ] = await Promise.all([
        prisma.scores.findMany({
            where: { userId },
            orderBy: [ { dateShot: "desc" }, { submittedAt: "desc" } ],
            skip,
            take,
        }),
        prisma.scores.count({ where: { userId } })
    ]);

    const hasMore = skip + scores.length < total;
    const totalPages = Math.ceil(total / pageSize);

    return NextResponse.json({ scores, hasMore, totalPages }, { status: 200 });
}
