"use client";

import { useState, useEffect } from "react";
import { User, IceDetails } from "@prisma/client";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { EnumMappings } from "@/app/lib/enumMappings";

export default function ProfileClient({ id }: { id: string }) {
    const [ user, setUser ] = useState<User | null>(null);
    const [ emergencyContacts, setEmergencyContacts ] = useState<IceDetails[] | null>(null);
    const [ loading, setLoading ] = useState(true);
    const [ error, setError ] = useState<string | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                setError(null);

                const [ userRes, emergencyContactsRes ] = await Promise.all([
                    await fetch(`/api/user/${id}`),
                    await fetch(`/api/ice-details/${id}`),
                ]);

                if (!userRes.ok) throw new Error("Failed to fetch user");
                if (!emergencyContactsRes.ok) throw new Error("Failed to fetch emergency contact details.");

                const [ user, emergencyContacts ] = await Promise.all([
                    userRes.json(),
                    emergencyContactsRes.json(),
                ])

                setUser(user);
                setEmergencyContacts(emergencyContacts);
            } catch (error) {
                setError(error instanceof Error ? error.message : "An error occurred whilst fetching data.");
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [ id ]);

    const iceColumns: GridColDef[] = [
        {
            field: "contactName",
            headerName: "Contact Name",
            flex: 1,
            sortable: false,
            filterable: false,
            hideable: false,
        },
        {
            field: "contactPhone",
            headerName: "Contact Phone Number",
            flex: 1,
            sortable: false,
            filterable: false,
            hideable: false,
        },
        {
            field: "contactEmail",
            headerName: "Contact Email Address",
            flex: 1,
            sortable: false,
            filterable: false,
            hideable: false,
        },
        {
            field: "relationshipType",
            headerName: "Relation to Contact",
            flex: 1,
            sortable: false,
            filterable: false,
            hideable: false,
        },
        {
            field: "updatedAt",
            headerName: "Last Updated",
            flex: 1,
            sortable: true,
            filterable: false,
            hideable: false,
        },
    ]

    const iceRows = emergencyContacts?.map((emergencyContact: IceDetails) => {
        return {
            id: emergencyContact.id,
            contactName: emergencyContact.contactName,
            contactPhone: emergencyContact.contactPhone,
            contactEmail: emergencyContact?.contactEmail || "-",
            relationshipType: emergencyContact.relationshipType ? EnumMappings[emergencyContact.relationshipType] || emergencyContact.relationshipType : "-",
            updatedAt: emergencyContact.updatedAt ? new Date(emergencyContact.updatedAt).toLocaleString() : "-",
        }
    }) || [];


    return (
        <>
            <div style={{ margin: "0 auto", padding: "2rem 3rem" }}>
                {loading && <p className="centred small">Loading...</p>}
                {error && <p className="centred small">{error}</p>}
                {!loading && !user && <p className="centred small">No user found.</p>}

                {!loading && user &&
                <>
                    <h4 style={{ marginBottom: "0.5rem" }}>Member Details:</h4>
                    {/** TODO */}

                    <h4 style={{ marginTop: "1rem", marginBottom: "0.5rem" }}>Emergency Contact Details:</h4>
                    <DataGrid
                        rows={iceRows}
                        columns={iceColumns}
                        getRowHeight={() => "auto"}
                        disableRowSelectionOnClick
                        localeText={{
                            noRowsLabel: loading
                                ? "Loading..."
                                : error
                                    ? "Error loading emergency contacts."
                                    : "No Emergency Contacts listed. Prompt the member to add one soon!"

                        }}
                        hideFooter={true}
                    />
                </>
                }
            </div>
        </>
    );
}
