import { NextRequest, NextResponse } from "next/server";
import indoorRounds from "@/app/lib/IndoorRounds.json";
import outdoorRounds from "@/app/lib/OutdoorRounds.json";
import { requireLoggedInUser } from "@/app/lib/server-utils";

/**
 * @swagger
 * /api/rounds:
 *   get:
 *     operationId: listRounds
 *     tags:
 *       - Rounds
 *     summary: Retrieve a list of archery rounds
 *     description: >
 *       Returns all available archery rounds filtered by type.
 *       Requires a logged-in user.
 *       Type parameter must be either "INDOOR" or "OUTDOOR".
 *     parameters:
 *       - in: query
 *         name: type
 *         required: true
 *         schema:
 *           type: string
 *           enum: [INDOOR, OUTDOOR]
 *         description: Filter rounds by type
 *     responses:
 *       200:
 *         description: List of rounds retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 rounds:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Round'
 *       400:
 *         description: Missing or invalid type parameter
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *     security:
 *       - SessionAuth: []
 */


export async function GET(request: NextRequest) {
    await requireLoggedInUser();
    // throw new Error("Simulated Error to test manual input");

    try {
        const { searchParams } = new URL(request.url);
        const sp = await searchParams;
        const type = sp.get("type");

        if (!type) {
            return NextResponse.json({ error: "Type parameter is required" }, { status: 400 });
        }

        let rounds;

        if (type.toUpperCase() === "INDOOR") {
            rounds = indoorRounds.map(round => ({
                name: round.name,
                codename: round.codename,
                body: round.body
            }));
        } else if (type.toUpperCase() === "OUTDOOR") {
            rounds = outdoorRounds.map(round => ({
                name: round.name,
                codename: round.codename,
                body: round.body,
            }));
        } else {
            return NextResponse.json({ error: 'Type must be either "indoor" or "outdoor"' }, { status: 400 });
        }

        // Sort rounds alphabetically by name
        rounds.sort((a, b) => a.name.localeCompare(b.name));

        return NextResponse.json({ rounds });
    } catch (error) {
        console.error("Error fetching rounds:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
