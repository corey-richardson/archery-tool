"use client";

import { getSession, signOut } from "next-auth/react";
import { useState, useEffect } from "react";

function CreateClub() {
    // State
    const [ session, setSession ] = useState<any>(null);
    const [ creatorId, setCreatorId ] = useState("");
    const [ clubName, setClubName ] = useState("");
    const [ changesPending, setChangesPending ] = useState(false);
    const [ isPending, setIsPending] = useState(false);


    // Session refresh function
    const refreshSessionData = async () => {
        try {
            const freshSession = await getSession();
            setSession(freshSession);
            if (freshSession) {
                setCreatorId(freshSession.user.id);
            }
            console.log('Session refreshed:', freshSession);
        } catch (error) {
            console.error('Failed to refresh session:', error);
        }
    };
    

    // Fetch session on mount
    useEffect(() => {
        refreshSessionData();
    }, []);

    
    // Handlers
    const handleSubmit = async(e: React.FormEvent) => {
        e.preventDefault();
        setIsPending(true);

        try {
            const res = await fetch("/api/club", {
                method: "POST",
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ clubName, creatorId, }),
            })

            console.log(res);

            if (res.status === 409) {
                const errorData = await res.json();
                alert(errorData.message || 'A club with that name already exists');
                setClubName("");
                setIsPending(false);
                return;
            }

            if (res.ok) {
                const data = await res.json();
                const clubId = data.createdClub.id;
                
                console.log('Club created with ID:', clubId);
                setIsPending(false);
                setClubName("");
                setChangesPending(false);

                await signOut({ redirect: false });
                window.location.href = `/admin/members/${clubId}`;
            } else {
                throw new Error(`HTTP error! status: ${res.status}`);
            }
        } catch (error) {
            console.error('Error creating club:', error);
            alert('An error occurred while creating the club');
            setIsPending(false);
        }
    }

    if (session === null) {
        return <h4 style={{"color": "black"}}>Loading...</h4>;
    }
    if (!session) {
        return <h4 style={{"color": "black"}}>No session found.</h4>;
    }

    return ( 
        <div className="content forms" style={{maxWidth: "80%"}}>
            <form onSubmit={handleSubmit}>
                <label>Club Name:</label>
                <input value={clubName} onChange={e => {
                    setClubName(e.target.value);
                    setChangesPending(true);
                }} />

                { !changesPending && <button disabled>Create Club</button> }
                { changesPending && !isPending && <button>Create Club</button> }
                { isPending && <button disabled>Creating Club...</button> }
                
                <p className="small centred">Note that after creating a club, you may need to sign in again to reload the session data and get access to the Club Management Tools.</p>
            </form>
        </div>
     );
}
 
export default CreateClub;
