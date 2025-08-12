import { ClubType } from "./ClubType";
import Link from "next/link";
import { EnumMappings } from "@/app/lib/enumMappings";
import { useState } from "react";

const rolePriority = [ "ADMIN", "CAPTAIN", "RECORDS", "COACH", "MEMBER" ];

const Club = ({ club, handleLeaveClub }: { club: ClubType, handleLeaveClub: () => Promise<{success: boolean, error?: string}> }) => {
    const [ leaving, setLeaving ] = useState(false);
    const [ error, setError ] = useState<string | null>(null);
    const [ showConfirm, setShowConfirm ] = useState(false);

    const userRole = rolePriority.find(role => club.membershipDetails.roles.includes(role));
    const isLink = [ "ADMIN", "CAPTAIN" ].some(role => club.membershipDetails.roles.includes(role));

    const onLeaveClub = async () => {
        setLeaving(true);
        setError(null);
        const result = await handleLeaveClub();
        if (!result.success) setError(result.error || "Failed to leave club.");
        setLeaving(false);
        setShowConfirm(false);
    };

    return (
        <div className="clubcard">
            {isLink ? (
                <Link href={`../admin/members/${club.id}?name=${encodeURIComponent(club.name)}`}><h3 className="left">{club.name}</h3></Link>
            ) : (
                <h3 className="left">{club.name}</h3>
            )}

            {userRole && <p className="small">{userRole}</p>}

            {Array.isArray(club.adminOrRecordsUsers) && club.adminOrRecordsUsers.length > 0 && (
                <div className="small">
                    <p className="bold" style={{marginBottom: "0"}}>Club Administrators:</p>
                    {club.adminOrRecordsUsers
                        .slice() // avoid mutating original array
                        .sort((a: any, b: any) => {
                            const aPriority = rolePriority.indexOf(a.highestRole);
                            const bPriority = rolePriority.indexOf(b.highestRole);
                            if (aPriority !== bPriority) return aPriority - bPriority;
                            return a.name.localeCompare(b.name);
                        })
                        .map((administrator: any) => (
                            <p key={administrator.id} style={{marginBottom: "0"}} >
                                {administrator.name} <span className="blue">({EnumMappings[administrator.highestRole]})</span>
                            </p>
                        ))}
                </div>
            )}

            <button
                className="btn-secondary"
                onClick={() => setShowConfirm(true)}
                disabled={leaving}
            >
                {leaving ? "Leaving..." : "Leave Club"}
            </button>

            {showConfirm && (
                <div
                    style={{
                        position: "fixed",
                        top: 0,
                        left: 0,
                        width: "100vw",
                        height: "100vh",
                        background: "rgba(0,0,0,0.3)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        zIndex: 1000,
                    }}
                >
                    <div
                        style={{
                            background: "#fff",
                            borderRadius: 8,
                            padding: 32,
                            boxShadow: "0 2px 16px rgba(0,0,0,0.2)",
                            minWidth: 320,
                            maxWidth: 480,
                            textAlign: "center",
                        }}
                    >
                        <h4 style={{marginBottom: "1rem"}}>Confirm Leave Club</h4>
                        <p>Are you sure you want to leave <b>{club.name}</b>? You will lose access to club features and may need to request to rejoin.</p>
                        <div style={{ display: "flex", justifyContent: "center", gap: "1.5rem", marginTop: "2rem" }}>
                            <button
                                className="btn btn-secondary"
                                onClick={() => setShowConfirm(false)}
                                disabled={leaving}
                            >Cancel</button>
                            <button
                                className="btn btn-primary"
                                onClick={onLeaveClub}
                                disabled={leaving}
                            >{leaving ? "Leaving..." : "Confirm Leave"}</button>
                        </div>
                    </div>
                </div>
            )}

            {error && <p className="small" style={{ color: "red" }}>{error}</p>}
        </div>
    );
}

export default Club;
