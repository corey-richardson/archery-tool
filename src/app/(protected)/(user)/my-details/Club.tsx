import { ClubType } from "./ClubType";
import Link from "next/link";
import { EnumMappings } from "@/app/lib/enumMappings";
import { useState } from "react";

const Club = ({ club, handleLeaveClub }: { club: ClubType, handleLeaveClub: () => Promise<{success: boolean, error?: string}> }) => {
    const [ leaving, setLeaving ] = useState(false);
    const [ error, setError ] = useState<string | null>(null);

    const rolePriority = ["ADMIN", "RECORDS", "COACH", "MEMBER"];
    const userRole = rolePriority.find(role => club.membershipDetails.roles.includes(role));
    const isLink = ["ADMIN", "RECORDS"].some(role => club.membershipDetails.roles.includes(role));

    const onLeaveClub = async () => {
        setLeaving(true);
        setError(null);
        const result = await handleLeaveClub();
        if (!result.success) setError(result.error || "Failed to leave club.");
        setLeaving(false);
    }

    return (
        <div className="clubcard">
            {isLink ? (
                <Link href={`../admin/members/${club.id}`}><h3 className="left">{club.name}</h3></Link>
            ) : (
                <h3 className="left">{club.name}</h3>
            )}

            {userRole && <p className="small">{userRole}</p>}

            {Array.isArray(club.adminOrRecordsUsers) && club.adminOrRecordsUsers.length > 0 && (
                <div className="small">
                    <p className="bold" style={{marginBottom: "0"}}>Club Administrators:</p>
                    {club.adminOrRecordsUsers.map((administrator: any) => (
                        <p key={administrator.id} style={{marginBottom: "0"}} >
                            {administrator.name} <span className="blue">({EnumMappings[administrator.highestRole]})</span>
                        </p>
                    ))}
                </div>
            )}

            <button
                className="btn-secondary"
                onClick={onLeaveClub}
                disabled={leaving}
            >
                {leaving ? "Leaving..." : "Leave Club"}
            </button>

            {error && <p className="small" style={{ color: "red" }}>{error}</p>}
        </div>
    );
}

export default Club;
