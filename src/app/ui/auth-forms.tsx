'use client';

import LoginForm from "@/app/ui/login-form";
import UserRegistrationForm from "@/app/ui/register-user";
import { useSession } from "next-auth/react";
import Link from "next/link";

const AuthForms = () => {

    const { data: session } = useSession();

    return ( 
        <>
            {!session && <div className="forms">
                <div>
                    <h3>Log in?</h3>
                    <p>Already a user? Log in <b className="blue">here</b>.</p>
                    <LoginForm />
                </div>
                <div>
                    <h3>Register...</h3>
                    <p><b className="blue">Sign up</b> now. It's <b className="blue">free</b>!</p>
                    <UserRegistrationForm />
                </div>
            </div>}

            {!!session && <div className="centred">
                <p>Go to <Link href="/my-details">My Details</Link>?</p>
            </div>}

        </>
     );
}
 
export default AuthForms;
