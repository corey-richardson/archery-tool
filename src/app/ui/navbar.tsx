'use client';

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
    { href: "/sign-out", label: "Sign Out?", admin: false },
];

const Navbar = () => {
    const [menuOpen, setMenuOpen] = useState(false);
    const pathname = usePathname();
    const loggedIn = true;
    const admin = true;

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
            </div>
        </nav>
     );
}
 
export default Navbar;