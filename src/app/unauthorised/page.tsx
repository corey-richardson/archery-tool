'use client';

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";

const Unauthorised = () => {

    const router = useRouter();
    const searchParams = useSearchParams();
    const reason = searchParams.get("reason");

    let signedIn = false;
    switch (reason) {
        case ("not-an-admin"): signedIn = true; break;
        case ("not-logged-in"): signedIn = false; break;
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
                        {signedIn && <Link href="/my-details" className="btn btn-primary">
                            Back to My Details
                        </Link>}

                        {!signedIn && <Link href="/" className="btn btn-primary">
                            Back to Dashboard
                        </Link>}

                        <button 
                            onClick={() => router.back()} 
                            className="btn btn-secondary"
                        >
                            ← Go Back
                        </button>
                    </div>
            
                </div>
            </div>
        </div>
    );
}
 
export default Unauthorised;
