import { useState } from "react";
import LoginForm from "./Login";
import ClubRegistrationForm from "./RegisterClub";
import UserRegistrationForm from "./RegisterUser";

const AuthForms = () => {
    const [ clubSelect, setClubSelect ] = useState("user");

    return ( 
        <>
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
        </>
     );
}
 
export default AuthForms;