'use client';

import { useState } from "react";
import Link from "next/link";

import { APP_NAME } from "@/app/lib/constants";

const Navbar = () => {
    const [menuOpen, setMenuOpen] = useState(false);
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
                <Link href="/my-details">My Details</Link>
                <Link href="/my-scores">My Scores</Link>
                <Link href="/submit-score">Submit a Score</Link>

                {admin && <Link href="/admin/members">Members Tools</Link>}
                {admin && <Link href="/admin/records">Records Tools</Link>}

                <Link href="/sign-out">Sign Out?</Link>
            </div>
        </nav>
     );
}
 
export default Navbar;

// import { signOut } from '@/auth';

// <form
//     action={async () => {
//         'use server';
//         await signOut({ redirectTo: '/' });
//     }}
// ></form> 
