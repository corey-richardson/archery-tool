"use client";

import React, { useState, useRef, useEffect } from "react";
import MemberManagement from "./MemberManagement";
import { getSession } from "next-auth/react";

function OutgoingInvites({ clubId }: { clubId: string }) {
    const [invites, setInvites] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchInvites = async () => {
        setLoading(true);
        setError(null);
        try {
            const res = await fetch(`/api/club/${clubId}/invites`);
            const data = await res.json();
            if (res.ok) setInvites(data.invites);
            else setError(data.error || "Failed to load invites");
        } catch (e) {
            setError("Failed to load invites");
        }
        setLoading(false);
    };

    useEffect(() => { fetchInvites(); }, [clubId]);

    return (
        <div style={{ margin: "2rem 0" }}>
            <h4>Outgoing Pending Invites</h4>
            {error && <div style={{ color: "red" }}>{error}</div>}
            {loading ? (
                <p>Loading invites...</p>
            ) : invites.length === 0 ? (
                <p>No pending invites.</p>
            ) : (
                <ul style={{ listStyle: "none", padding: 0 }}>
                    {invites.map(invite => (
                        <li key={invite.id} style={{ marginBottom: 12, border: "1px solid #ccc", borderRadius: 6, padding: 10 }}>
                            <div><b>ArcheryGB Number:</b> {invite.archeryGBNumber || (invite.user && invite.user.archeryGBNumber) || "-"}</div>
                            <div><b>Invited:</b> {invite.user?.name || invite.archeryGBNumber || "Unknown"}</div>
                            <div><b>Sent:</b> {new Date(invite.createdAt).toLocaleDateString()}</div>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}

export default function MemberManagementClient({ club }: { club: any }) {
    const [deleting, setDeleting] = useState(false);
    const [showDialog, setShowDialog] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const [userId, setUserId] = useState<string | undefined>(undefined);

    useState(() => {
        getSession().then(session => {
            setUserId(session?.user?.id);
        });
    });

    const handleDelete = async () => {
        setDeleting(true);
        setError(null);
        try {
            const res = await fetch(`/api/club/${club.club.id}`, {
                method: "DELETE",
                headers: { "Content-Type": "application/json" },
            });
            if (res.ok) {
                window.location.href = "/my-details";
            } else {
                setError("Failed to delete club.");
            }
        } catch (e) {
            setError("Error deleting club.");
        } finally {
            setDeleting(false);
        }
    };

    function InviteForm({ clubId }: { clubId: string }) {
        const [archeryGBNumber, setArcheryGBNumber] = useState("");
        const [loading, setLoading] = useState(false);
        const [success, setSuccess] = useState<string | null>(null);
        const [error, setError] = useState<string | null>(null);
        const inputRef = useRef<HTMLInputElement>(null);

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
                    setSuccess("Invite sent!");
                    setArcheryGBNumber("");
                    inputRef.current?.focus();
                } else {
                    setError(data.error || "Failed to send invite");
                }
            } catch (e) {
                setError("Error sending invite");
            } finally {
                setLoading(false);
            }
        };

        return (
            <form onSubmit={handleSubmit} style={{ margin: "2rem 0", display: "flex", gap: 8, alignItems: "center" }}>
                <h3>Invite Member:</h3>
                <input
                    ref={inputRef}
                    type="text"
                    placeholder="ArcheryGB Number"
                    value={archeryGBNumber}
                    onChange={e => setArcheryGBNumber(e.target.value)}
                    required
                    style={{ padding: "0.5rem", borderRadius: 4, border: "1px solid #ccc", minWidth: 180 }}
                    disabled={loading}
                />
                <button
                    type="submit"
                    disabled={loading || !archeryGBNumber}
                    style={{ padding: "0.5rem 1.5rem", borderRadius: 4, background: "#007bff", color: "#fff", border: "none", cursor: loading ? "not-allowed" : "pointer" }}
                >
                    {loading ? "Sending..." : "Send Invite"}
                </button>
                {success && <span style={{ color: "green", marginLeft: 8 }}>{success}</span>}
                {error && <span style={{ color: "red", marginLeft: 8 }}>{error}</span>}
            </form>
        );
    }

    return (
        <>
            {showDialog && (
                <div style={{
                    position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh',
                    background: 'rgba(0,0,0,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000
                }}>
                    <div style={{ background: '#fff', padding: '2rem', borderRadius: 8, minWidth: 320, boxShadow: '0 2px 16px rgba(0,0,0,0.2)' }}>
                        <h4>Delete Club</h4>
                        <p>Are you sure you want to delete the club "{club.club.name}"? This cannot be undone.</p>
                        {error && <div style={{ color: 'red', marginBottom: 8 }}>{error}</div>}
                        <div style={{ display: 'flex', gap: 12, marginTop: 16 }}>
                            <button
                                onClick={() => setShowDialog(false)}
                                disabled={deleting}
                                style={{ padding: '0.5rem 1.5rem', borderRadius: 4, border: '1px solid #888', background: '#eee', color: '#333', cursor: deleting ? 'not-allowed' : 'pointer' }}
                            >
                Cancel
                            </button>
                            <button
                                onClick={handleDelete}
                                disabled={deleting}
                                style={{ padding: '0.5rem 1.5rem', borderRadius: 4, background: '#c00', color: '#fff', border: 'none', cursor: deleting ? 'not-allowed' : 'pointer' }}
                            >
                                {deleting ? 'Deleting...' : 'Delete Club'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <MemberManagement club={club} />
            <InviteForm clubId={club.club.id} />
            <OutgoingInvites clubId={club.club.id} />

            <button
                onClick={() => setShowDialog(true)}
                disabled={deleting}
                style={{ marginBottom: "1.5rem", background: "#c00", color: "#fff", border: "none", padding: "0.5rem 1.5rem", borderRadius: 4, cursor: deleting ? "not-allowed" : "pointer" }}
            >
        Delete Club
            </button>
        </>
    );
}