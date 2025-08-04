'use client';

import Link from "next/link";
import { useRouter } from "next/navigation";

const NotFound = () => {

    const router = useRouter();

    return (
        <div className="content">
            <div className="not-found-container">
                <div className="not-found-content">

                    <div className="error-code">404</div>

                    <div className="archery-target">
                        <div className="target-ring outer"></div>
                        <div className="target-ring middle"></div>
                        <div className="target-ring inner"></div>
                        <div className="target-center">
                            <span className="miss-text">MISS!</span>
                        </div>
                    </div>

                    <h2>Looks like your arrow missed the target.</h2>
                    <p>The page you're looking for doesn't exist or has been moved.</p>

                    <div className="not-found-actions">
                        <Link href="/" className="btn btn-primary">
                            Back to Dashboard
                        </Link>
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

export default NotFound;
