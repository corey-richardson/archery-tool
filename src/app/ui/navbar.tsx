'use client';

import { signOut, useSession } from "next-auth/react";

import { useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import clsx from "clsx";

import { APP_NAME } from "@/app/lib/constants";

const navLinks = [
    { href: "/my-details", label: "My Details", admin: false },
    { href: "/my-scores", label: "My Scores", admin: false },
    { href: "/submit-score", label: "Submit a Score", admin: false },
    { href: "/admin/members", label: "Members Tools", admin: true },
    { href: "/admin/records", label: "Records Tools", admin: true },
];

const Navbar = () => {

    const { data: session, status } = useSession();

    const [menuOpen, setMenuOpen] = useState(false);
    const pathname = usePathname();
    
    const loggedIn = !!session;
    const admin = session?.user?.role === "ADMIN";
    console.log(session?.user);

    return ( 
        <nav className="navbar blue">
            <h1>{ APP_NAME }</h1>
            <button
                className="burger"
                aria-label="Toggle menu"
                onClick={() => setMenuOpen((open) => !open)}
            >
                <span />
                <span />
                <span />
            </button>
            <div className={`links${menuOpen ? " open" : ""}`}>
                {navLinks
                    .filter(link => loggedIn && (!link.admin || admin))
                    .map(link => (
                        <Link
                            key={link.href}
                            href={link.href}
                            className={clsx({ active: pathname === link.href })}
                        >
                            {link.label}
                        </Link>
                    ))}

                <form action={async () => {
                        signOut({ callbackUrl: "/" });
                    }}>
                    <button
                        type="submit"
                        className={clsx("navbar-link-button", { active: pathname === "/logout" })}
                        style={{
                          background: "none",
                          border: "none",
                          padding: "8px 12px",
                          borderRadius: "var(--border-radius)",
                          color: "var(--text-color)",
                          cursor: "pointer",
                          font: "inherit",
                          transition: "all 0.3s ease"
                        }}
                    >
                        Sign Out
                    </button>
                </form>
            </div>
        </nav>
     );
}
 
export default Navbar;