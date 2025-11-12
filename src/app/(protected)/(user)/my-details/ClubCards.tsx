"use client";

import { useEffect, useState } from "react";
import Club from "./Club";
import Link from "next/link";

type ClubcardProps = {
    userId: string;
}

export default function ClubCards( { userId } : ClubcardProps ) {

    const [ clubs, setClubs ] = useState([]);
    const [ isLoading, setIsLoading ] = useState(true);

    const [ invites, setInvites ] = useState(0);
    const [ error, setError ] = useState<string | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true);
            setError(null);

            try {
                const [ clubResponse, inviteResponse ] = await Promise.all([
                    fetch(`/api/users/${userId}/clubs`),
                    fetch(`/api/users/invites`)
                ]);

                const [ clubsData, invitesData ] = await Promise.all([
                    clubResponse.json(),
                    inviteResponse.json()
                ]);

                if (clubResponse.ok) {
                    setClubs(clubsData.clubs);
                } else {
                    setError(clubsData.error || "Failed to load clubs.");
                }

                if (inviteResponse.ok) {
                    setInvites(invitesData.invites.length);
                } else {
                    setError(invitesData.error || "Failed to load invites.");
                }
            }
            catch (error) {
                setError("Failed to load data: " + error);
            }
            finally {
                setIsLoading(false);
            }
        }

        fetchData();
    }, [ userId ]);

    const handleLeaveClub = async (clubId: string) => {
        try {
            const res = await fetch(`/api/clubs/${clubId}/users/${userId}`, {
                method: "DELETE",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ clubId, userId }),
            });

            if (!res.ok) {
                const data = await res.json();
                return { success: false, error: data.error || "Failed to leave club." };
            }

            setClubs(prev => prev.filter((club: any) => club.id !== clubId));
            return { success: true };
        } catch (error) {
            console.error(error);
            return { success: false, error: "Failed to leave club." };
        }
    }

    return (
        <>
            <h3>My Clubs.</h3>
            <p className="centred">
                Here you can view all the archery clubs you are currently a member of. Clubs provide access to events, records, and community features.
            </p>

            { isLoading && (
                <div className="content">
                    <p className="centred">Loading...</p>
                </div>
            )}

            { !isLoading && clubs && clubs.length == 0 && (
                <div className="content">
                    <p className="centred bold">You're not part of any clubs yet!</p>
                </div>
            )}

            { !isLoading && clubs && clubs.length > 0 && (
                <>
                    <div className="clubcard-list">
                        {clubs.map((club: any) => (
                            <Club
                                key={club.id}
                                club={club}
                                handleLeaveClub={() => handleLeaveClub(club.id)}
                            />
                        ))}
                    </div>

                </>
            )}

            <p className="centred">To join a club, ask one of your Club's Admins to send you an invite now. If you are a Committee member of a Club, you can <Link className="blue bold" href="./club/create">Create a New Club</Link> instead.</p>
            <button className="btn-secondary"><Link className="blue bold" href="./club/invites">View Invites ({ invites })</Link></button>

            {error && <div style={{ color: "red" }}>{error}</div>}
        </>
    )
}
