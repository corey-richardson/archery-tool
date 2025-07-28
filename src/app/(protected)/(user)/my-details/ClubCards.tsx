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
            <h3>My Clubs.</h3>
            <p className="centred">Lorem ipsum dolor sit amet consectetur adipisicing elit. Eius vitae facilis fuga voluptas autem, perspiciatis placeat, incidunt provident veniam eaque mollitia aliquam voluptate eos cumque officia illo consequuntur porro aperiam.</p>

            { isLoading && (
                <div className="content">
                    <p className="centred">Loading...</p>
                </div>
            )}

            { !isLoading && clubs.length == 0 && (
                <div className="content">
                    <p className="centred">You're not part of any clubs yet!</p>
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
