import React, { useState } from "react";
import { checkAdminsAccess } from "@/app/actions/requireAccess";

export default function EndMembershipCell({ params, clubId, setError, }: { params: any; clubId: string; setError: (msg: string | null) => void; }) {
    const [ ended, setEnded ] = useState(!!params.row.endedAt);
    console.log(params.row.endedAt);

    const handleEndMembership = async () => {
        if (ended) return;

        const admin = await checkAdminsAccess();
        if (!admin) {
            setError("Only admins can remove people from the club.");
            return;
        }

        const confirmed = window.confirm(`Are you sure you want to end "${params.row.name}"'s membership?`);
        if (!confirmed) return;


        try {
            const response = await fetch(`/api/clubs/${clubId}/users/${params.row.userId}`, {
                method: "DELETE",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    clubId,
                    userId: params.row.userId
                }),
            });

            if (!response.ok) {
                const { error } = await response.json();
                throw new Error(error || "Failed to end membership");
            }

            setError(null);
            setEnded(true);
        } catch (error) {
            setError((error as Error).message || "Failed to end membership.");
        }
    };

    if (!params.row.endedAt || params.row.endedAt === "-") {
        return (
            <button
                className="btn"
                onClick={handleEndMembership}
                disabled={ended}
                style={{
                    padding: "4px 8px",
                    background: ended ? "#6c757d" : "#dc3545",
                    color: "white",
                    border: "none",
                    borderRadius: "4px",
                    cursor: ended ? "not-allowed" : "pointer",
                }}
            >
                {ended ? "Ended" : "End"}
            </button>
        );
    }

    return <span>{params.row.endedAt}</span>;
}
