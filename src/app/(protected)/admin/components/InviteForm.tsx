"use client";

import React, { useState, useRef, useEffect } from "react";
import { getSession } from "next-auth/react";

export function InviteForm({ clubId }: { clubId: string }) {
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
        <div style={{paddingBottom: "2rem"}}>
            <h3>Invite Member</h3>
            <form onSubmit={handleSubmit} className="centred" >
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
        </div>
    );
}
