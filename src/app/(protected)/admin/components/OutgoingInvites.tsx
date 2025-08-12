"use client";

import React, { useState } from "react";

type Invite = {
    id: string;
    archeryGBNumber?: string;
    user?: {
        archeryGBNumber?: string;
        name?: string;
    };
    createdAt: string;
};

interface OutgoingInvitesProps {
    invites: Invite[];
    loading: boolean;
    handleRescind: (inviteId: string) => void;
}

export default function OutgoingInvites({ invites, loading, handleRescind }: OutgoingInvitesProps) {
    const [ error ] = useState<string | null>(null);
    const [ rescindingId ] = useState<string | null>(null);

    return (
        <div>
            <h3>Outgoing Pending Invites</h3>
            {error && <div style={{ color: "red" }}>{error}</div>}
            {loading ? (
                <></>
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
                                    >{ rescindingId === invite.id ? "Rescinding invite..." : "Rescind invite to Club" }</button>
                                </div>
                            </div>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}