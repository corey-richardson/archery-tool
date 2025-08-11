import type { Metadata } from "next";
import { APP_NAME } from "./lib/constants";
import { Providers } from "./providers";
import "./globals.css";

export const metadata: Metadata = {
    title: `${ APP_NAME }`,
    description: "Archery Tool",
};

export default function RootLayout({
    children,
}: Readonly<{
  children: React.ReactNode;
}>) {
    return (
        <html lang="en">
            <body>
                <Providers>
                    {children}
                </Providers>
            </body>
        </html>
    );
}
