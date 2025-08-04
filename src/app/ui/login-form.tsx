// app/auth/signin/page.tsx

"use client";

import { signIn } from "next-auth/react";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function SignInPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const res = await signIn("credentials", {
            email,
            password,
            redirect: false,
            callbackUrl: "/my-details",
        });

        if (res?.ok && res.url) {
            router.push(res.url);
        } else {
            alert("Sign-in failed");
        }
    };

    return (
        <>
            <form onSubmit={handleSubmit}>
                <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="Email" required />
                <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Password" required />
                <button type="submit">Sign in</button>
            </form>

            <button className="btn-secondary" onClick={() => signIn("google", { callbackUrl: "/my-details" })}>Sign in with Google</button>
            <button className="btn-secondary" onClick={() => signIn("github", { callbackUrl: "/my-details" })}>Sign in with GitHub</button>
        </>
    );
}
