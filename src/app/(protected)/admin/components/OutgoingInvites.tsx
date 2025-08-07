"use client";

import React, { useState, useEffect } from "react";

export default function OutgoingInvites({ clubId }: { clubId: string }) {
    const [invites, setInvites] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [rescindingId, setRescindingId] = useState<string | null>(null);

    const handleRescind = async (inviteId: string) => {
        setRescindingId(inviteId);
        setError(null);

        try {
            const res = await fetch(`/api/invites/${inviteId}`, {
                method: "DELETE",
                headers: { "Content-Type": "application/json" },
            });

            if (res.ok) {
                setInvites(prev => prev.filter(invite => invite.id !== inviteId));
            } else {
                const data = await res.json();
                setError(data.error || "Failed to rescind invite.");
            }
        } catch (error) {
            setError("Error rescinding invite: " + error);
        } finally {
            setRescindingId(null);
        }
    }

    useEffect(() => {
        const fetchInvites = async () => {
            setLoading(true);
            setError(null);
            try {
                const res = await fetch(`/api/club/${clubId}/invites`);
                const data = await res.json();
                if (res.ok) setInvites(data.invites);
                else setError(data.error || "Failed to load invites");
            } catch (error) {
                setError("Failed to load invites: " + error);
            }
            setLoading(false);
        };
        fetchInvites(); }, [clubId]
    );

    return (
        <div>
            <h3>Outgoing Pending Invites</h3>
            {error && <div style={{ color: "red" }}>{error}</div>}
            {loading ? (
                <p className="centred">Loading invites...</p>
            ) : invites.length === 0 ? (
                <p className="centred">No pending invites.</p>
            ) : (
                <ul style={{ listStyle: "none", padding: 0 }}>
                    {invites.map(invite => (
                        <li key={invite.id} style={{ marginBottom: 12, border: "1px solid #ccc", borderRadius: 6, padding: 10 }}>
                            <div style={{display: "flex", justifyContent: "space-between", alignContent: "center", alignItems: "center", margin: "0 2rem"}}>
                                <div style={{flex: 4}}>
                                    <div><b>ArcheryGB Number:</b> {invite.archeryGBNumber || (invite.user && invite.user.archeryGBNumber) || "-"}</div>
                                    <div><b>Invited:</b> {invite.user?.name || "Unknown User"}</div>
                                    <div><b>Sent:</b> {new Date(invite.createdAt).toLocaleString()}</div>
                                </div>

                                <div style={{flex: 1}}>
                                    <button
                                        className="btn btn-secondary"
                                        onClick={() => handleRescind(invite.id)}
                                        disabled={rescindingId === invite.id}
                                    >{ rescindingId === invite.id ? "Rescinding Invite..." : "Rescind Invite to Club" }</button>
                                </div>
                            </div>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}