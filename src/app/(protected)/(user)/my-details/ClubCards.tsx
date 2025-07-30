"use client";

import { useEffect, useState, useRef } from 'react';
import Club from './Club';
import Link from "next/link";

type ClubcardProps = {
    userId: string;
}

export default function ClubCards( { userId } : ClubcardProps ) {

    const [ clubs, setClubs ] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    const fetchUsersClubs = async () => {
        const res = await fetch(`/api/club?userId=${userId}`);
        const data = await res.json();
        setClubs(data.clubs);

        setIsLoading(false);
    }

    useEffect(() => {
        fetchUsersClubs();
    }, [userId]);

    return (
        <>
            <h3>My Clubs.</h3>

            { isLoading && (
                <div className="content">
                    <p className="centred">Loading...</p>
                </div>
            )}

            { !isLoading && clubs.length == 0 && (
                <div className="content">
                    <p className="centred bold">You're not part of any clubs yet!</p>
                </div>
            )}

            { !isLoading && clubs.length > 0 && (
                <>
                    <div className="clubcard-list">
                        {clubs.map((club: any) => (
                            <Club key={club.id} club={club} />
                        ))}
                    </div>

                </>
            )}

            <p className="centred">To join a club, ask one of your Club's Admins to send you an <Link className="blue bold" href="./club/invites">invite</Link> now. If you are a Committee member of a Club, you can <Link className="blue bold" href="./club/create">Create a New Club</Link> instead.</p>
        </>
    )
}
