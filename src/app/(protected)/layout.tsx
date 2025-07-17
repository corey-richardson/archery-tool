import type { Metadata } from "next";
import { APP_NAME } from "../lib/constants";
import "../globals.css";
import Navbar from "../ui/navbar";

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
        <Navbar />
        {children}
      </body>
    </html>
  );
}
