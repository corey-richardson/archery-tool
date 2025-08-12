import { DataGrid, GridColDef } from "@mui/x-data-grid";
import calculateAgeCategory from "@/app/lib/calculateAgeCategory";
import { EnumMappings } from "@/app/lib/enumMappings";
import { useState } from "react";
import RolesCell from "./RolesCell";
import Link from "next/link";
import { checkAdminsAccess } from "@/app/actions/requireAccess";

interface Member {
  id: string;
  userId: string;
  roles: string[];
  joinedAt?: string;
  endedAt?: string | null;
  user?: {
    id: string;
    name: string;
    email: string;
    archeryGBNumber?: string;
    sex?: string | null;
    gender?: string | null
    yearOfBirth?: number | null;
  };
}

interface Club {
  id: string;
  name: string;
  members: Member[];
  club: Club;
}

export default function MemberManagement({ club }: { club: Club }) {
    const [ error, setError ] = useState<string | null>(null);

    const columns: GridColDef[] = [
        {
            field: "name",
            headerName: "Name",
            flex: 1,
            sortable: true,
            renderCell: (params) => (
                // An entire row *could* be passed via a client-side global store, requires a context to be set up
                <Link href={`/admin/members/member/${params.row.userId}?name=${encodeURIComponent(params.row.name)}`}>
                    {params.value || "Unknown"}
                    {/** onClick={() => setSelectedMember(params.row)} */}
                </Link>
                // Then on next page,
                // const member = useSelectedMember();
            )
        },

        { field: "email", headerName: "Email", flex: 1, sortable: true },
        { field: "archeryGBNumber", headerName: "ArcheryGB Number", flex: 1, sortable: true },
        { field: "sex", headerName: "Sex (+ Pronouns)", flex: 0.8, sortable: true },
        { field: "yearOfBirth", headerName: "Year of Birth", flex: 0.7, sortable: true },
        { field: "ageCategory", headerName: "Age Category", flex: 0.8, sortable: true },

        {
            field: "roles",
            headerName: "Roles (Ctrl+Click to add)",
            flex: 1,
            sortable: false,

            renderCell: (params) => (
                <RolesCell
                    value={params.value}
                    row={params.row}
                    clubId={club.club.id}
                    setError={setError}
                />
            ),

        },

        { field: "joinedAt", headerName: "Joined", flex: 0.8, sortable: true },

        { 
            field: "endedAt", 
            headerName: "End Membership", 
            flex: 0.8,
            renderCell: (params) => {
                const [ended, setEnded] = useState(!!params.row.endedAt);
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
                        const response = await fetch("/api/club/leave", {
                            method: "POST",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify({
                                clubId: club.club.id,
                                userId: params.row.userId
                            }),
                        });

                        if (!response.ok) {
                            const { error } = await response.json();
                            throw new Error(error || "Failed to end membership");
                        }

                        setEnded(true);
                    } catch (error) {
                        setError(error.message || "Failed to end membership.");
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
        }
    ];

    const rows = club.members
        .filter((member) => !member.endedAt)
        .map((member) => {
            return {
                id: member.id,
                userId: member.userId,
                name: member.user?.name || "Unknown",
                email: member.user?.email || "Unknown",
                archeryGBNumber: member.user?.archeryGBNumber || "-",
                sex: member.user?.sex ? EnumMappings[member.user.sex] + (member.user?.gender ? ` (${member.user?.gender})`  : "") : "-",
                yearOfBirth: member.user?.yearOfBirth || "-",
                ageCategory:
          member.user?.yearOfBirth
              ? EnumMappings[calculateAgeCategory(member.user.yearOfBirth)]
              : EnumMappings["SENIOR"],
                roles: member.roles,
                joinedAt: member.joinedAt ? new Date(member.joinedAt).toLocaleDateString() : "-",
                endedAt: member.endedAt ? new Date(member.endedAt).toLocaleDateString() : null,
            };
        });

    return (
        <div style={{ width: "100%", marginTop: "1rem", paddingBottom: "2rem" }}>
            <DataGrid
                rows={rows}
                getRowHeight={() => "auto"}
                columns={columns}
                initialState={{
                    pagination: { paginationModel: { pageSize: 10, page: 0 } },
                    sorting: {
                        sortModel:
                            [ {
                                field: "name",
                                sort: "asc"
                            } ]
                    }
                }}
                pageSizeOptions={[ 10, 25, 50 ]}
                disableRowSelectionOnClick
            />

            {error && <p className="small centred" style={{ color: "red" }}>{error}</p>}
        </div>
    );
}
