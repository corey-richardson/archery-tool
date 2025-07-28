"use client";

import { useEffect, useState, useRef } from 'react';
import Club from './Club';

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
        console.log(data.clubs);
        setIsLoading(false);
    }

    useEffect(() => {
        fetchUsersClubs();
    }, [userId]);

    return (
        <>
            { isLoading && (
                <div className="content">
                    <h4 className="centred">Loading...</h4>
                </div>
            )}

            { !isLoading && clubs.length == 0 && (
                <div className="content">
                    <h4 className="centred">You're not part of any clubs yet!</h4>
                </div>
            )}

            { !isLoading && clubs.length > 0 && (
                <>
                    <div className="scorecard-list">
                        {clubs.map((club: any) => (
                            <Club key={club.id} club={club} />
                        ))}
                    </div>
                </>
            )}
        </>
    )
}
