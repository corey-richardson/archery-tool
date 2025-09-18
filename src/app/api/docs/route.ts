import { NextResponse } from "next/server";
import path from "path";
import fs from "fs";

/**
 * @swagger ignore
 */


export async function GET() {
    try {
        const swaggerPath = path.join(process.cwd(), "public", "swagger.json");

        if (!fs.existsSync(swaggerPath)) {
            return NextResponse.json({
                openapi: "3.0.0",
                info: {
                    title: "Archery Tool API",
                    version: "1.0",
                    description: "API documentation - run build to generate full spec",
                },
                paths: {},
            });
        }

        const swaggerContent = fs.readFileSync(swaggerPath, "utf8");
        const spec = JSON.parse(swaggerContent);

        return NextResponse.json(spec);
    } catch (error) {
        console.error("Error serving API docs:", error);
        return NextResponse.json(
            { error: "Failed to load API documentation" },
            { status: 500 }
        );
    }
}