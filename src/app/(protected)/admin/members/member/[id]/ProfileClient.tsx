"use client";

import { useState, useEffect } from "react";
import { User, IceDetails } from "@prisma/client";

export default function ProfileClient({ id }: { id: string }) {
    const [ user, setUser ] = useState<User | null>(null);
    const [ emergencyContacts, setEmergencyContacts ] = useState<IceDetails[] | null>(null);
    const [ loading, setLoading ] = useState(true);
    const [ error, setError ] = useState<string | null>(null);

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

    if (loading) return <p>Loading...</p>;
    if (error) return <p>{ error }</p>
    if (!user) return <p>No user found.</p>

    return (
        <div style={{ margin: "0 auto", padding: "2rem 3rem" }}>
            <p>{ user.defaultBowstyle }</p>
            { emergencyContacts && emergencyContacts.map(emergencyContact => (
                <p key={emergencyContact.id}>{ emergencyContact.contactName }</p>
            ))}
        </div>
    );
}
