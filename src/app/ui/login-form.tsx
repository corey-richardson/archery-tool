// app/auth/signin/page.tsx

"use client";

import { signIn } from "next-auth/react";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function SignInPage() {

    return (
        <div className="content">
            <h3 className="centred blue">Sign In with OAuth Providers</h3>
            <button className="btn-secondary" onClick={() => signIn("google", { callbackUrl: "/my-details" })}>Sign in with Google</button>
            <button className="btn-secondary" onClick={() => signIn("github", { callbackUrl: "/my-details" })}>Sign in with GitHub</button>
            <p></p>
            <p className="centred small">This website uses OAuth Single Sign-On over traditional username-password credential based authentication for improved security and user experience. OAuth providers offer protection against password theft, phishing and brute-force attacks. SSO streamlines the login process, allowing users to access the platform without managing or creating new credentials. By using trusted OAuth third-party providers, this website reduces the risk of data breaches and ensures compliance with web authentication standards.</p>
            <p className="centred small">Is there a provider you would like to be able to sign in with on <a href="https://github.com/nextauthjs/next-auth/tree/39dd3b92de194c1a835f2d87631f4deb9d9fdf65/packages/core/src/providers" target="_blank">this list</a>? Contact me or raise an issue on <a href="https://github.com/corey-richardson/archery-tool/issues" target="_blank">GitHub</a> and I'll attempt to add it!</p>
            <p className="centred small bold">Your passwords are never shared directly with the application.</p>
        </div>
    );
}
