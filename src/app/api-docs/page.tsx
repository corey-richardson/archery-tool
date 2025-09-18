import { getApiDocs } from "@/app/lib/swagger";
import SwaggerUIClient from "./swagger-ui-client";

export const dynamic = "force-dynamic";

export default async function ApiDocsPage() {
    try {
        const specs = await getApiDocs();
        return <SwaggerUIClient specs={specs} />;
    } catch (error) {
        console.error("Failed to load API documentation:", error);
        return (
            <div style={{ padding: "2rem", textAlign: "center", color: "red" }}>
                <h2>Error Loading Documentation</h2>
                <p>Failed to generate API documentation. Please try refreshing the page.</p>
            </div>
        );
    }
}
