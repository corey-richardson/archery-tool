"use client";

import SwaggerUI from "swagger-ui-react";
import "swagger-ui-react/swagger-ui.css";

interface SwaggerUIClientProps {
    specs: any;
}

export default function SwaggerUIClient({ specs }: SwaggerUIClientProps) {
    return <SwaggerUI spec={specs} />;
}