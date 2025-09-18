"use client";

import SwaggerUI from "swagger-ui-react";
import "swagger-ui-react/swagger-ui.css";
import { useEffect, useState } from "react";

export default function ApiDocsPage() {
    const [ specs, setSpecs ] = useState<any>(null);
    const [ loading, setLoading ] = useState(true);
    const [ error, setError ] = useState<string | null>(null);

    useEffect(() => {
        fetch("/api/docs")
            .then(res => {
                if (!res.ok) {
                    throw new Error(`HTTP error! status: ${res.status}`);
                }
                return res.json();
            })
            .then(data => {
                setSpecs(data);
                setLoading(false);
            })
            .catch(err => {
                console.error("Failed to load API documentation:", err);
                setError(err.message);
                setLoading(false);
            });
    }, []);

    if (loading) {
        return (
            <div style={{ padding: "2rem", textAlign: "center" }}>
                <h2>Loading API Documentation...</h2>
                <p>Please wait while we generate the documentation.</p>
            </div>
        );
    }

    if (error) {
        return (
            <div style={{ padding: "2rem", textAlign: "center", color: "red" }}>
                <h2>Error Loading Documentation</h2>
                <p>Failed to load API documentation: {error}</p>
                <button
                    onClick={() => window.location.reload()}
                    style={{
                        marginTop: "1rem",
                        padding: "0.5rem 1rem",
                        backgroundColor: "#007cba",
                        color: "white",
                        border: "none",
                        borderRadius: "4px",
                        cursor: "pointer"
                    }}
                >
          Retry
                </button>
            </div>
        );
    }

    return <SwaggerUI spec={specs} />;
}
