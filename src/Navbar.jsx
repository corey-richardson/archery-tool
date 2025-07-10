import { useState } from "react";
import { Link } from "react-router-dom";

import { APP_NAME } from "./Constants";

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
                <Link to="/">Dashboard</Link>

                {loggedIn && <Link to="/">My Details</Link>}
                {loggedIn && <Link to="/">My Scores</Link>}
                {loggedIn && <Link to="/">Submit a Score</Link>}

                {loggedIn && admin && <Link to="/">Members Tools</Link>}
                {loggedIn && admin && <Link to="/">Records Tools</Link>}
            </div>
        </nav>
     );
}
 
export default Navbar;