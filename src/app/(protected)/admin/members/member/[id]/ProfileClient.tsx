"use client";

import { useState, useEffect } from "react";
import { User, IceDetails } from "@prisma/client";
import { useRouter } from "next/navigation";

export default function ProfileClient({ id }: { id: string }) {
    const [ user, setUser ] = useState<User | null>(null);
    const [ emergencyContacts, setEmergencyContacts ] = useState<IceDetails[] | null>(null);
    const [ loading, setLoading ] = useState(true);
    const [ error, setError ] = useState<string | null>(null);

    const router = useRouter();

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                setError(null);

                const [ userRes, emergencyContactsRes ] = await Promise.all([
                    await fetch(`/api/user/${id}`),
                    await fetch(`/api/ice-details/${id}`),
                ]);

                if (!userRes.ok) throw new Error("Failed to fetch user");
                if (!emergencyContactsRes.ok) throw new Error("Failed to fetch emergency contact details.");

                const [ user, emergencyContacts ] = await Promise.all([
                    userRes.json(),
                    emergencyContactsRes.json(),
                ])

                setUser(user);
                setEmergencyContacts(emergencyContacts);
            } catch (error) {
                setError(error instanceof Error ? error.message : "An error occurred whilst fetching data.");
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [ id ]);

    return (
        <>
            <button
                onClick={() => router.back()}
                className="btn btn-secondary"
            >
                ← Return to Club Management Page
            </button>


            <div style={{ margin: "0 auto", padding: "2rem 3rem" }}>
                {loading && <p>Loading...</p>}
                {error && <p>{error}</p>}
                {!loading && !user && <p>No user found.</p>}

                {!loading && user && (
                    <>
                        <p>{user.defaultBowstyle}</p>
                        {emergencyContacts && emergencyContacts.map(emergencyContact => (
                            <p key={emergencyContact.id}>{emergencyContact.contactName}</p>
                        ))}
                    </>
                )}
            </div>
        </>
    );
}
