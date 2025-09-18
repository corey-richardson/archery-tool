import { NextResponse } from "next/server";
import { getApiDocs } from "@/app/lib/swagger";

/**
 * @swagger ignore
 */

export async function GET() {
    try {
        const specs = await getApiDocs();
        return NextResponse.json(specs);
    } catch (error) {
        console.error("Error generating API docs:", error);
        return NextResponse.json(
            { error: "Failed to generate API documentation" },
            { status: 500 }
        );
    }
}
