import { NextResponse } from "next/server";
import { getApiDocs } from "@/app/lib/swagger";

/**
 * @swagger ignore
 */

export async function GET() {
    try {
        console.log("Generating API docs...");
        const specs = await getApiDocs();
        console.log("Generated specs:", {
            pathsCount: Object.keys((specs as any).paths || {}).length,
            title: (specs as any).info?.title
        });
        return NextResponse.json(specs);
    } catch (error) {
        console.error("Error generating API docs:", error);
        return NextResponse.json(
            { error: "Failed to generate API documentation", details: error instanceof Error ? error.message : String(error) },
            { status: 500 }
        );
    }
}
