"use server";

import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "../api/auth/authOptions";

interface Membership {
    roles: string[];
}

interface User {
    id: string;
    email: string;
    name: string;
    memberships: Membership[];
}

export async function requireLoggedInUser() {
    const session = await getServerSession(authOptions);
    if (!session?.user.id) redirect("/unauthorised?reason=not-logged-in");

    return {
        id: session.user.id,
        email: session.user.email,
        name: session.user.name,
        memberships: session.user.memberships || [],
    };
}

export async function requireRecordsUserOrHigher() {
    const user = await requireLoggedInUser();

    const isAdmin = (user as User).memberships.some((membership: Membership) =>
        membership.roles.includes("ADMIN") || membership.roles.includes("CAPTAIN") || membership.roles.includes("RECORDS")
    );

    if (!isAdmin) redirect("/unauthorised?reason=not-an-admin");

    return user;
}

export async function requireCaptainUserOrHigher() {
    const user = await requireLoggedInUser();

    const isAdmin = (user as User).memberships.some((membership: Membership) =>
        membership.roles.includes("ADMIN") || membership.roles.includes("CAPTAIN")
    );

    if (!isAdmin) redirect("/unauthorised?reason=not-an-admin");

    return user;
}

export async function requireAdminUser() {
    const user = await requireLoggedInUser();


    const isAdmin = (user as User).memberships.some((membership: Membership) =>
        membership.roles.includes("ADMIN")
    );

    if (!isAdmin) redirect("/unauthorised?reason=not-an-admin");

    return user;
}
