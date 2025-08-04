"use server";

import { signOut } from "next-auth/react";

export async function serverLogout() {
    await signOut({ callbackUrl: "/" });
}
