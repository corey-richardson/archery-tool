'use client';

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { signOut } from "next-auth/react";

function UnauthorisedContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const reason = searchParams.get("reason");

    let signedIn = true;
    let sessionExpired = false;

    switch (reason) {
        case ("not-logged-in"): signedIn = false; break;
        case ("session-expired"): sessionExpired = true; break;
        default: break;
    }

    return (
        <div className="content">
            <div className="not-found-container">
                <div className="not-found-content">

                    <div className="error-code">401</div>

                    <div className="archery-target">
                        <div className="target-ring outer"></div>
                        <div className="target-ring middle"></div>
                        <div className="target-ring inner"></div>
                        <div className="target-center">
                            <span className="miss-text">NO!</span>
                        </div>
                    </div>

                    <h2>You're not allowed to access this page!</h2>

                    <div className="not-found-actions">

                        {signedIn && !sessionExpired && 
                        <Link href="/my-details" className="btn btn-primary">
                            Back to My Details
                        </Link>}

                        {!signedIn && 
                        <Link href="/" className="btn btn-primary">
                            Back to Dashboard
                        </Link>}

                        {!sessionExpired && 
                        <button
                            onClick={() => router.back()}
                            className="btn btn-secondary"
                        >
                            ← Go Back
                        </button>}

                        {sessionExpired && 
                        <form action={() => signOut({ callbackUrl: "/" })}>
                            <button
                                type="submit"
                                className="btn btn-primary"
                            >
                                Sign Out
                            </button>
                        </form>}

                    </div>

                </div>
            </div>
        </div>
    )
}

const Unauthorised = () => {
    return (
        <Suspense fallback={ <p>Loading...</p> }>
            <UnauthorisedContent />
        </Suspense>
    )
}

export default Unauthorised;
