import { useState } from "react";
import { useNavigate } from "react-router-dom";

const ClubRegistrationForm = () => {

    const [ clubName, setClubName ] = useState("");
    const [ email, setEmail ] = useState("");
    const [ password, setPassword ] = useState("");
    const [ confirmedPassword, setConfirmedPassword ] = useState("");

    const [ isPending, setIsPending ] = useState(false);

    const navigate = useNavigate();

    const handleSubmit = (e) => {
        e.preventDefault();

        // POST
        navigate("/");
    }

    return ( 
        <>
            <form onSubmit={handleSubmit} className="registration-form">
                <input type="text"
                required
                placeholder="Club Name:"
                value={ clubName }
                onChange={(event) => setClubName(event.target.value)}></input>

                <input type="email"
                required
                placeholder="Email:"
                value={ email }
                onChange={(event) => setEmail(event.target.value.replace(/\s/g, ''))}></input>

                <input type="password"
                required
                placeholder="Password:"
                minLength={8}
                value={ password }
                onChange={(event) => setPassword(event.target.value.replace(/\s/g, ''))}></input>

                <input type="password"
                required
                placeholder="Confirm Password:"
                minLength={8}
                value={ confirmedPassword }
                onChange={(event) => setConfirmedPassword(event.target.value.replace(/\s/g, ''))}></input>

                { !isPending && <button>Register as club</button> }
                { isPending && <button disabled>Registering...</button>}
            </form>
        </>
     );
}
 
export default ClubRegistrationForm;