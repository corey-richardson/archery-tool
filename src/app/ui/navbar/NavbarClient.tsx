'use client';

import { signOut } from "next-auth/react";
import { useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import clsx from "clsx";

import { APP_NAME } from "@/app/lib/constants";

const navLinks = [
  { href: "/club", label: "Clubs", admin: false },
  { href: "/my-details", label: "My Details", admin: false },
  { href: "/my-scores", label: "My Scores", admin: false },
  { href: "/submit-score", label: "Submit a Score", admin: false },
  { href: "/admin/members", label: "Members Tools", admin: true },
  { href: "/admin/records", label: "Records Tools", admin: true },
];

export default function NavbarClient({ session }: { session: any }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();

  const admin = session?.user?.memberships?.some((m: any) => m.roles.includes("ADMIN"));

  return (
    <nav className="navbar blue">
      <h1>{APP_NAME}</h1>
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
          .filter((link) => session?.user && (!link.admin || admin))
          .map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={clsx({ active: pathname === link.href })}
            >
              {link.label}
            </Link>
          ))}

        <form action={() => signOut({ callbackUrl: "/" })}>
          <button 
            type="submit"
            className={clsx("navbar-link-button", { active: pathname === "/logout" })}
          >
            Sign Out
          </button>
        </form>
      </div>
    </nav>
  );
}
