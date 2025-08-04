import type { Metadata } from "next";
import { APP_NAME } from "../lib/constants";
import "../globals.css";

export const metadata: Metadata = {
    title: `${ APP_NAME }`,
    description: "Archery Tool",
};

export default function Layout({
    children,
}: Readonly<{
  children: React.ReactNode;
}>) {
    return (
        <>
            {children}
        </>
    );
}
