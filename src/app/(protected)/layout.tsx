import type { Metadata } from "next";
import { APP_NAME } from "../lib/constants";
import "../globals.css";
import Navbar from "../ui/navbar";

export const metadata: Metadata = {
  title: {
    template: `%s | ${ APP_NAME }`,
    default:  `${ APP_NAME }`,
  },
  description: "Archery Tool",
};

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
        <Navbar />
        {children}
    </>
  );
}
