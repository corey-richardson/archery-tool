"use client";

import React, { useState, useRef, useEffect } from "react";
import { getSession } from "next-auth/react";

export function InviteForm({ clubId, onInviteSubmitted }: { clubId: string; onInviteSubmitted?: () => void }) {
    const [archeryGBNumber, setArcheryGBNumber] = useState("");
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);
    const inputRef = useRef<HTMLInputElement>(null);
    const [userId, setUserId] = useState<string | undefined>(undefined);

    useEffect(() => {
        getSession().then(session => {
            setUserId(session?.user?.id);
        });
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setSuccess(null);
        setError(null);
        try {
            const res = await fetch(`/api/club/${clubId}/invite`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ archeryGBNumber, invitedBy: userId }),
            });
            const data = await res.json();
            if (res.ok) {
                setSuccess("Invite sent!")
                setTimeout(() => setSuccess(""), 3000);
                setArcheryGBNumber("");
                inputRef.current?.focus();
                onInviteSubmitted?.();
            } else {
                setError(data.error || "Failed to send invite");
            }
        } catch (error) {
            setError("Error sending invite: " + error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{paddingBottom: "2rem"}}>
            <h3>Invite Member</h3>
            <p className="centred small" style={{marginBottom: "0.5rem"}}>Invite a member by entering their Archery GB number. If the user has not registered yet, the invite will remain valid and can be accepted once they sign up and link their Archery GB number to their account.</p>
            <p className="centred small" style={{marginBottom: "1.5rem"}}>Please note: Archery GB numbers are unique and can only be associated with one account. Until a user links their Archery GB number, there is a risk that someone else could register with that number first. This does not give them access to the details of ant other members of the club.</p>

            <form onSubmit={handleSubmit} className="centred" >
                <input
                    ref={inputRef}
                    type="text"
                    placeholder="ArcheryGB Number"
                    value={archeryGBNumber}
                    onChange={e => setArcheryGBNumber(e.target.value)}
                    required
                    style={{ padding: "0.5rem", borderRadius: 4, border: "1px solid #ccc", minWidth: 200 }}
                    disabled={loading}
                />
                <button
                    type="submit"
                    disabled={loading || !archeryGBNumber}
                    style={{ marginLeft: "0.5rem", padding: "0.5rem 1.5rem", borderRadius: 4, background: "#007bff", color: "#fff", border: "none", cursor: loading ? "not-allowed" : "pointer" }}
                >
                    {loading ? "Sending..." : "Send Invite"}
                </button>

                {success && <span style={{ color: "green", marginLeft: "0.5rem" }}>{success}</span>}
                {error && <span style={{ color: "red", marginLeft: "0.5rem" }}>{error}</span>}
            </form>
        </div>
    );
}
