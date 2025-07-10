import { useState } from "react";
import { Link } from "react-router-dom";

import { APP_NAME } from "./Constants";

import LoginForm from "./forms/Login";
import ClubRegistrationForm from "./forms/RegisterClub";
import UserRegistrationForm from "./forms/RegisterUser";

const Dashboard = () => {
    const loggedIn = false;

    const [ clubSelect, setClubSelect ] = useState("user");

    return ( 
        <div className="content">
            <div className="dashboard-image-container">
                <h1>{ APP_NAME }</h1>
                <p>This app is a tool for managing archery club membership and records. It allows club administrators to register members and maintain detailed records of scores and achievements. The interface is designed to be user-friendly and easy to use, and provides an Open-Source alternative to existing paid-products.</p>
           
                <div className="links">
                    <a href="https://www.github.com/corey-richardson" target="_blank">GitHub</a>
                    <a href="https://github.com/corey-richardson/archery-tool" target="_blank">Repository</a>
                    <a href="https://www.linktr.ee/coreyrichardson" target="_blank">LinkTree</a>
                    <a href="https://wakatime.com/@coreyrichardson/projects/fcdqybsfaa?start=2025-07-05&end=2025-07-10" target="_blank">WakaTime</a>
                    <a href="https://coff.ee/corey.richardson" target="_blank">Buy Me a Coffee</a>
                </div>
                <div className="links">
                    <a href="https://www.upsu.com/sports/clubs/archery/" target="_blank">Created for UPSU Archery</a>
                    <a href="https://www.archerycalculator.co.uk" target="_blank">Archery Calculator</a>
                    <a href="https://archerygeekery.co.uk" target="_blank">Archery Geekery</a>
                </div>
                
                <p className="small">&copy; corey-richardson 2025, Photo by Jonathon Yau via Archery GB</p>
            </div>

            <div className="content centred">
                <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>
            </div>

            {!loggedIn && (
                <div className="auth-forms">
                    <div>
                        <h3>Log in?</h3>
                        <p>Already a user? Log in <b className="blue">here</b>.</p>
                        <LoginForm />
                    </div>
                    <div>
                        <h3>Register...</h3>
                        <p><b className="blue">Sign up</b> now. It's <b className="blue">free</b>!</p>
                            <select onChange={(event) => setClubSelect(event.target.value)}>
                                <option value="user">...as a user?</option>
                                <option value="club">...as a club?</option>
                            </select>
                        
                        { clubSelect == "user" && <UserRegistrationForm /> }
                        { clubSelect == "club" && <ClubRegistrationForm /> }
                    </div>
                </div>
            ) }

            {loggedIn && (
                <div className="centred">
                    <p>Go to <Link to="/details">My Details</Link>?</p>
                </div>
            )}
        </div>
     );
}
 
export default Dashboard;