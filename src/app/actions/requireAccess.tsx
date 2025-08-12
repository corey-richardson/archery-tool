"use server";

import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/authOptions";
import { redirect } from "next/navigation";

export async function requireRecordsAccess() {
    const session = await getServerSession(authOptions);

    const activeMembership = session?.user?.memberships?.find(
        (m: any) => m.endedAt === null
    );

    const hasAccess =
        activeMembership &&
        (activeMembership.roles.includes("ADMIN") ||
         activeMembership.roles.includes("CAPTAIN") ||
         activeMembership.roles.includes("RECORDS"));

    if (!session || !hasAccess) {
        redirect("/unauthorised?reason=not-authorised-for-records");
    }
}

export async function requireCaptainsAccess() {
    const session = await getServerSession(authOptions);

    const activeMembership = session?.user?.memberships?.find(
        (m: any) => m.endedAt === null
    );

    const hasAccess =
        activeMembership &&
        (activeMembership.roles.includes("ADMIN") ||
         activeMembership.roles.includes("CAPTAIN"));

    if (!session || !hasAccess) {
        redirect("/unauthorised?reason=not-an-admin");
    }
}

export async function requireAdminsAccess() {
    const session = await getServerSession(authOptions);

    const activeMembership = session?.user?.memberships?.find(
        (m: any) => m.endedAt === null
    );

    const hasAccess =
        activeMembership &&
        (activeMembership.roles.includes("ADMIN"));

    if (!session || !hasAccess) {
        redirect("/unauthorised?reason=not-an-admin");
    }
}

export async function checkAdminsAccess() {
    const session = await getServerSession(authOptions);

    const activeMembership = session?.user?.memberships?.find(
        (m: any) => m.endedAt === null
    );

    const hasAccess =
        activeMembership &&
        (activeMembership.roles.includes("ADMIN"));

    if (!session || !hasAccess) {
        return false;
    }

    return true;
}