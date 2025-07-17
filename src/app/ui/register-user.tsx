import { useState } from "react";
import { useRouter } from "next/navigation";

const UserRegistrationForm = () => {

    const [ firstName, setFirstName ] = useState("");
    const [ lastName, setLastName ] = useState("");
    const [ email, setEmail ] = useState("");
    const [ username, setUsername ] = useState("");
    const [ password, setPassword ] = useState("");
    const [ confirmedPassword, setConfirmedPassword ] = useState("");

    const [ isPending, setIsPending ] = useState(false);

    const router = useRouter();

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (username.includes(' '))
        {
            alert("Username cannot contain spaces.");
            return;
        }

        if (password != confirmedPassword)
        {
            alert("Passwords don't match!");
            return;
        }

        // POST
        router.push("/");
    }

    return ( 
        <>
            <form onSubmit={handleSubmit} className="registration-form">
                <input type="text"
                required
                placeholder="First Name:"
                value={ firstName }
                onChange={(event) => setFirstName(event.target.value)}></input>

                <input type="text"
                required
                placeholder="Last Name:"
                value={ lastName }
                onChange={(event) => setLastName(event.target.value)}></input>

                <input type="email"
                required
                placeholder="Email:"
                value={ email }
                onChange={(event) => setEmail(event.target.value.replace(/\s/g, ''))}></input>

                <input type="text"
                required
                placeholder="Username:"
                value={ username }
                onChange={(event) => setUsername(event.target.value.replace(/\s/g, ''))}></input>

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

                { !isPending && <button>Register as user</button> }
                { isPending && <button disabled>Registering...</button>}
            </form>
        </>
     );
}
 
export default UserRegistrationForm;
