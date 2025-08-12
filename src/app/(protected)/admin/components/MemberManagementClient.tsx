"use client";

import React, { useState, useEffect, useCallback } from "react";
import MemberManagement from "./MemberManagement";
import { InviteForm } from "./InviteForm";
import OutgoingInvites from "./OutgoingInvites";
import { Invite } from "@prisma/client";

export default function MemberManagementClient({ club, admin }: { club: any, admin: boolean }) {

    const [ deleting, setDeleting ] = useState(false);
    const [ showDialog, setShowDialog ] = useState(false);
    const [ error, setError ] = useState<string | null>(null);
    const [ confirmDeletion, setConfirmDeletion ] = useState("");
    const [ invites, setInvites ] = useState<Invite[]>([]);
    const [ loadingInvites, setLoadingInvites ] = useState(true);

    const fetchInvites = useCallback(async () => {
        setLoadingInvites(true);
        setError(null);
        try {
            const res = await fetch(`/api/club/${club.club.id}/invites`);
            const data = await res.json();
            if (res.ok) setInvites(data.invites);
            else setError(data.error || "Failed to load invites");
        } catch (error) {
            setError("Failed to load invites: " + error);
        }
        setLoadingInvites(false);
    }, [ club.club.id ]);

    useEffect(() => {
        fetchInvites();
    }, [ fetchInvites ]);

    const handleInviteSubmitted = () => {
        fetchInvites();
    };

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
        } catch (error) {
            setError("Error deleting club: " + error);
        } finally {
            setDeleting(false);
        }
    };

    const handleRescind = async (inviteId: string) => {
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
        }
    }

    return (
        <div className="content">
            {showDialog && admin && (
                <div style={{
                    position: "fixed", top: 0, left: 0, width: "100vw", height: "100vh",
                    background: "rgba(0,0,0,0.3)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000
                }}>
                    <div style={{ background: "#fff", padding: "2rem", borderRadius: 8, minWidth: 320, boxShadow: "0 2px 16px rgba(0,0,0,0.2)" }}>
                        <h4>Delete Club</h4>
                        <p>Are you sure you want to delete the club "{club.club.name}"? This cannot be undone.</p>
                        <p>Type the Club's full name to continue.</p>

                        <input className="forms" value={confirmDeletion} onChange={e => setConfirmDeletion(e.target.value)} />
                        {error && <div style={{ color: "red", marginBottom: 8 }}>{error}</div>}

                        <div style={{ display: "flex", gap: 12, marginTop: 16 }}>
                            <button
                                onClick={() => setShowDialog(false)}
                                disabled={deleting}
                                style={{ padding: "0.5rem 1.5rem", borderRadius: 4, border: "1px solid #888", background: "#eee", color: "#333", cursor: deleting ? "not-allowed" : "pointer" }}
                            >
                Cancel
                            </button>
                            <button
                                onClick={handleDelete}
                                disabled={deleting || club.club.name.trim() !== confirmDeletion.trim()}
                                style={{
                                    padding: "0.5rem 1.5rem",
                                    borderRadius: 4,
                                    background: deleting || club.club.name.trim() !== confirmDeletion.trim() ? "#ccc" : "#c00",
                                    color: deleting || club.club.name.trim() !== confirmDeletion.trim() ? "#666" : "#fff",
                                    border: "none",
                                    cursor: deleting || club.club.name.trim() !== confirmDeletion.trim() ? "not-allowed" : "pointer",
                                    opacity: deleting || club.club.name.trim() !== confirmDeletion.trim() ? 0.6 : 1,
                                    transition: "all 0.2s ease"
                                }}
                            >
                                {deleting ? "Deleting..." : "Delete Club"}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <MemberManagement club={club} />

            {admin && (
                <>
                    <InviteForm clubId={club.club.id} onInviteSubmitted={handleInviteSubmitted} />
                    {invites.length > 0 && <OutgoingInvites
                        invites={invites}
                        loading={loadingInvites}
                        handleRescind={handleRescind}
                    />}
                    {loadingInvites && <p className="centred small">Loading...</p>}
                    <hr style={{ margin: "2rem 0" }}/>
                    <h3>Danger Zone</h3>
                    <div style={{ display: "flex", justifyContent: "center" }}>
                        <button
                            className="centred"
                            onClick={() => setShowDialog(true)}
                            disabled={deleting}
                            style={{ marginBottom: "1.5rem", background: "#c00", color: "#fff", border: "none", padding: "0.5rem 1.5rem", borderRadius: 4, cursor: deleting ? "not-allowed" : "pointer" }}
                        >Delete Club
                        </button>
                    </div>
                </>
            )}
        </div>
    );
}