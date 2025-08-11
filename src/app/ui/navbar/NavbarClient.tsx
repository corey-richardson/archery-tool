"use client";

import { signOut } from "next-auth/react";
import { useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import clsx from "clsx";

import { APP_NAME } from "@/app/lib/constants";

const roleHierarchy = ["MEMBER", "COACH", "RECORDS", "CAPTAIN", "ADMIN"];

const navLinks = [
    { href: "/my-details", label: "My Details" },
    { href: "/my-scores", label: "My Scores" },
    { href: "/submit-score", label: "Submit a Score" },
    // { href: "/admin/members", label: "Members Tools", minRole: "CAPTAIN" },
    { href: "/admin/records", label: "Records Tools", minRole: "RECORDS" },
];

function getHighestRole(roles: string[]): string {
    return roleHierarchy
        .slice()
        .reverse()
        .find(role => roles.includes(role)) || "MEMBER";
}

export default function NavbarClient({ session }: { session: any }) {
    const [menuOpen, setMenuOpen] = useState(false);
    const pathname = usePathname();

    const activeMembership = session?.user?.memberships?.find(
        (m: any) => m.endedAt === null
    );

    const userRoles: string[] = activeMembership?.roles || [];
    const userRole = getHighestRole(userRoles);

    const canAccess = (minRole?: string) => {
        if (!minRole) return true;
        return roleHierarchy.indexOf(userRole) >= roleHierarchy.indexOf(minRole);
    };

    return (
        <nav className="navbar blue">
            <h1>{APP_NAME}</h1>

            <button
                className="burger"
                aria-label="Toggle menu"
                onClick={() => setMenuOpen(open => !open)}
            >
                <span />
                <span />
                <span />
            </button>

            <div className={`links${menuOpen ? " open" : ""}`}>
                {navLinks
                    .filter(link => session?.user && canAccess(link.minRole))
                    .map(link => (
                        <Link
                            key={link.href}
                            href={link.href}
                            className={clsx({ active: pathname === link.href })}
                            onClick={() => {
                                setTimeout(() => setMenuOpen(false), 300);
                            }}
                        >
                            {link.label}
                        </Link>
                    ))
                }

                <form action={() => signOut({ callbackUrl: "/" })}>
                    <button
                        type="submit"
                        className={clsx("navbar-link-button", {
                            active: pathname === "/logout",
                        })}
                    >
                        Sign Out
                    </button>
                </form>
            </div>
        </nav>
    );
}
