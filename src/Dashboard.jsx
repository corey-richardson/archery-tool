import { useState } from "react";
import { Link } from "react-router-dom";

import { APP_NAME } from "./Constants";

import Banner from "./Banner/Banner";
import LoginForm from "./forms/Login";
import ClubRegistrationForm from "./forms/RegisterClub";
import UserRegistrationForm from "./forms/RegisterUser";

const Dashboard = () => {
    const loggedIn = false;

    const [ clubSelect, setClubSelect ] = useState("user");

    return ( 
        <div className="content">
            <Banner />

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