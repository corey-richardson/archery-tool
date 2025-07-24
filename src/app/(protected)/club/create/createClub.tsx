"use client";

import { getSession } from "next-auth/react";
import { useState, useEffect } from "react";

function CreateClub() {
    // State
    const [ session, setSession ] = useState<any>(null);
    const [ creatorId, setCreatorId ] = useState("");
    const [ clubName, setClubName ] = useState("");
    const [ changesPending, setChangesPending ] = useState(false);
    const [ isPending, setIsPending] = useState(false);

    // Fetch session on mount
    useEffect(() => {
        getSession().then(session => {
            setSession(session);
            if (session) {
                setCreatorId(session.user.id);
            }
        });
    }, []);

    

    // Handlers
    const handleSubmit = async(e: React.FormEvent) => {
        e.preventDefault();
        setIsPending(true);

        const res = await fetch("/api/club", {
            method: "POST",
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ clubName, creatorId, }),
        })

        if (res.ok) {
            setIsPending(false);
            setClubName("");
        }
    }

    if (session === null) {
        return <h4 style={{"color": "black"}}>Loading...</h4>;
    }
    if (!session) {
        return <h4 style={{"color": "black"}}>No session found.</h4>;
    }

    return ( 
        <div>
            <form onSubmit={handleSubmit}>
                <label>Club Name:</label>
                <input value={clubName} onChange={e => {
                    setClubName(e.target.value);
                    setChangesPending(true);
                }} />

                { changesPending && !isPending && <button>Create Club</button> }
                { !changesPending && <button disabled>Create Club</button> }
                { isPending && <button disabled>Creating Club...</button> }
            </form>
        </div>
     );
}
 
export default CreateClub;
