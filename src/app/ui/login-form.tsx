import { useState } from "react";

const LoginForm = () => {

    const [ email, setEmail ] = useState("");
    const [ password, setPassword ] = useState("");

    const [ isPending, setIsPending ] = useState(false);

    return ( 
        <>
            <form className="login-form">
                <input type="email"
                required
                placeholder="Email:"
                value={ email }
                onChange={(event) => setEmail(event.target.value)}></input>

                <input type="password"
                required
                placeholder="Password:"
                value={ password}
                onChange={(event) => setPassword(event.target.value)}></input>

                { !isPending && <button>Login</button> }
                { isPending && <button disabled>Logging in...</button>}
            </form>
        </>
    );
}
 
export default LoginForm;
