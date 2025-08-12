"use client";

import { useEffect, useState } from "react";

type Invite = {
  id: string;
  club: { id: string; name: string };
  inviter: { name: string };
  createdAt: string;
};

const ClubInvites = () => {
    const [ invites, setInvites ] = useState<Invite[]>([]);
    const [ loading, setLoading ] = useState(true);
    const [ actionLoading, setActionLoading ] = useState<string | null>(null);
    const [ error, setError ] = useState<string | null>(null);

    const fetchInvites = async () => {
        setLoading(true);
        setError(null);
        try {
            const res = await fetch("/api/user/invites");
            const data = await res.json();
            if (res.ok) setInvites(data.invites);
            else setError(data.error || "Failed to load invites");
        } catch (error) {
            setError("Failed to load invites: " + error);
        }
        setLoading(false);
    };

    useEffect(() => { fetchInvites(); }, []);

    const handleAccept = async (inviteId: string) => {
        setActionLoading(inviteId);
        setError(null);
        try {
            const res = await fetch(`/api/invites/${inviteId}/accept`, { method: "POST" });
            if (!res.ok) {
                const data = await res.json();
                setError(data.error || "Failed to accept invite");
            } else {
                fetchInvites();
            }
        } catch {
            setError("Failed to accept invite");
        }
        setActionLoading(null);
    };

    const handleDecline = async (inviteId: string) => {
        setActionLoading(inviteId);
        setError(null);
        try {
            const res = await fetch(`/api/invites/${inviteId}`, { method: "DELETE" });
            if (!res.ok) {
                const data = await res.json();
                setError(data.error || "Failed to decline invite");
            } else {
                fetchInvites();
            }
        } catch {
            setError("Failed to decline invite");
        }
        setActionLoading(null);
    };

    return (
        <div className="content">
            <h1 className="blue centred" style={{paddingBottom: "2rem"}}>Club Invites.</h1>

            {error && <div style={{ color: "red" }}>{error}</div>}

            {loading ? (
                <p>Loading invites...</p>
            ) : invites.length === 0 ? (
                <p>No pending invites.</p>
            ) : (
                <ul style={{ listStyle: "none", padding: 0 }}>
                    {invites.map(invite => (
                        <li key={invite.id} style={{ marginBottom: 24, border: "1px solid #ccc", borderRadius: 8, padding: 16 }}>
                            <div><b>Club:</b> {invite.club.name}</div>
                            <div><b>Invited by:</b> {invite.inviter?.name || "Unknown"}</div>
                            <div><b>Invited on:</b> {new Date(invite.createdAt).toLocaleDateString()}</div>
                            <div style={{ marginTop: 12, display: "flex", gap: 8 }}>
                                <button
                                    className="btn btn-primary"
                                    onClick={() => handleAccept(invite.id)}
                                    disabled={actionLoading === invite.id}
                                >
                                    {actionLoading === invite.id ? "Processing..." : "Accept"}
                                </button>
                                <button
                                    className="btn btn-secondary"
                                    onClick={() => handleDecline(invite.id)}
                                    disabled={actionLoading === invite.id}
                                    style={{ color: "#a00" }}
                                >
                                    {actionLoading === invite.id ? "Processing..." : "Decline"}
                                </button>
                            </div>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default ClubInvites;
