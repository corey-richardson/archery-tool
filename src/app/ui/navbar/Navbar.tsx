import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/authOptions";
import NavbarClient from "./NavbarClient";

export default async function Navbar() {
    const session = await getServerSession(authOptions);
    return <NavbarClient session={session} />;
}
