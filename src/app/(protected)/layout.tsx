import type { Metadata } from "next";
import { APP_NAME } from "../lib/constants";
import "../globals.css";
import Navbar from "../ui/navbar/Navbar";

import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from '@/app/api/auth/authOptions';

export const metadata: Metadata = {
    title: {
        template: `%s | ${ APP_NAME }`,
        default:  `${ APP_NAME }`,
    },
    description: "Archery Tool",
};

export default async function Layout({
    children,
}: Readonly<{
  children: React.ReactNode;
}>) {

    const session = await getServerSession(authOptions);

    if (!session) {
        redirect("/unauthorised?reason=not-logged-in");
    }

    return (
        <>
            <Navbar />
            {children}
        </>
    );
}
