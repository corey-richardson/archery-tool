import { useState } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";

const ClubRegistrationForm = () => {

    const [ clubName, setClubName ] = useState("");
    const [ email, setEmail ] = useState("");
    const [ password, setPassword ] = useState("");
    const [ confirmedPassword, setConfirmedPassword ] = useState("");

    const [ isPending, setIsPending ] = useState(false);

    const router = useRouter();

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();

        if (password != confirmedPassword)
        {
            alert("Passwords don't match!");
            return;
        }

        const name = clubName;
        const accountType = "CLUB";

        const res = await fetch("/api/register", {

            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, email, password, accountType },)                    
        });

        if (res.ok) {
            console.log("res.ok");
            setIsPending(false);
            await signIn('credentials', {
                email,
                password,
                callbackUrl: '/admin/members',
            });
        } else {
            let errorMessage = "Registration failed";

            try {
                const data = await res.json();
                if (data?.message) {
                errorMessage = data.message;
                }
            } catch (e) {
                // No JSON body – ignore
            }

            console.error(errorMessage);
        }
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
