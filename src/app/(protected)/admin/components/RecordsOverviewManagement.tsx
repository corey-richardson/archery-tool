"use client";

import { EnumMappings } from "@/app/lib/enumMappings";
import { useEffect, useState } from "react";
import { Overview } from "../../(user)/my-scores/Overview";
import { DataGrid, GridColDef } from "@mui/x-data-grid";

const indoorClassifications = [
    "IA3", "IA2", "IA1", "IB3", "IB2", "IB1", "IMB", "IGMB", "UNCLASSIFIED"
];
const outdoorClassifications = [
    "A3", "A2", "A1", "B3", "B2", "B1", "MB", "GMB", "EMB", "UNCLASSIFIED"
];


const changeHandler = async (
    field: string,
    newValue: string,
    overview: Overview,
    setCurrent: (val: string) => void
) => {
    setCurrent(newValue);

    const valueToSendToBackend = (field == "indoorHandicap" || field == "outdoorHandicap")
        ? (newValue === "" ? null : Number(newValue))
        : newValue;

    try {
        const response = await fetch(`/api/scores/overview/${overview.userId}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ field: field, value: valueToSendToBackend }),
        });

        if (!response.ok) {
            throw new Error("Failed to update overview.");
        }
    } catch (error) {
        setCurrent(overview[field as keyof Overview] as string);
        console.error(error);
    }
}


const IndoorClassification = ({ overview }: { overview: Overview}) => {
    const [ current, setCurrent ] = useState(overview.indoorClassification || "");

    const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        changeHandler("indoorClassification", event.target.value, overview, setCurrent);
    }

    return (
        <select value={current} onChange={handleChange} style={{ width: "100%", textAlign: "center" }}>
            <option value="" disabled>-</option>
            {indoorClassifications.map(opt => (
                <option key={opt} value={opt}>
                    {EnumMappings[opt] || opt}
                </option>
            ))}
        </select>
    )
}


const IndoorBadgeGiven = ({ overview }: { overview: Overview}) => {
    const [ current, setCurrent ] = useState(overview.indoorBadgeGiven || "");

    const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        changeHandler("indoorBadgeGiven", event.target.value, overview, setCurrent);
    }

    return (
        <select value={current} onChange={handleChange} style={{ width: "100%", textAlign: "center" }}>
            <option value="" disabled>-</option>
            {indoorClassifications.map(opt => (
                <option key={opt} value={opt}>
                    {EnumMappings[opt] || opt}
                </option>
            ))}
        </select>
    )
}


const IndoorHandicap = ({ overview }: { overview: Overview}) => {
    const [ current, setCurrent ] = useState(overview.indoorHandicap?.toString() || "");

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        changeHandler("indoorHandicap", event.target.value, overview, setCurrent);
    }

    return (
        <input
            value={current}
            onChange={handleChange}
            type="number"
            min="0" max="150" step="1"
            style={{width: "100%"}}
        />
    )
}


const OutdoorClassification = ({ overview }: { overview: Overview}) => {
    const [ current, setCurrent ] = useState(overview.outdoorClassification || "");

    const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        changeHandler("outdoorClassification", event.target.value, overview, setCurrent);
    }

    return (
        <select value={current} onChange={handleChange} style={{ width: "100%", textAlign: "center" }}>
            <option value="" disabled>-</option>
            {outdoorClassifications.map(opt => (
                <option key={opt} value={opt}>
                    {EnumMappings[opt] || opt}
                </option>
            ))}
        </select>
    )
}


const OutdoorBadgeGiven = ({ overview }: { overview: Overview}) => {
    const [ current, setCurrent ] = useState(overview.outdoorBadgeGiven || "");

    const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        changeHandler("outdoorBadgeGiven", event.target.value, overview, setCurrent);
    }

    return (
        <select value={current} onChange={handleChange} style={{ width: "100%", textAlign: "center" }}>
            <option value="" disabled>-</option>
            {outdoorClassifications.map(opt => (
                <option key={opt} value={opt}>
                    {EnumMappings[opt] || opt}
                </option>
            ))}
        </select>
    )
}


const OutdoorHandicap = ({ overview }: { overview: Overview}) => {
    const [ current, setCurrent ] = useState(overview.outdoorHandicap?.toString() || "");

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        changeHandler("outdoorHandicap", event.target.value, overview, setCurrent);
    }

    return (
        <input
            value={current}
            onChange={handleChange}
            type="number"
            min="0" max="150" step="1"
            style={{width: "100%"}}
        />
    )
}


export default function RecordsOverviewManagement({ userId }: { userId: string}) {
    const [ isLoading, setIsLoading ] = useState(false);
    const [ overview, setOverview ] = useState<Overview>();
    const [ notes, setNotes ] = useState("");

    useEffect(() => {
        const fetchUserOverview = async () => {
            setIsLoading(true);
            let res = await fetch(`/api/user/${userId}`);
            let data = await res.json();
            res = await fetch(`/api/scores/overview/${userId}`);
            data = await res.json();
            setOverview(data);
            setNotes(data?.notes || "");
            setIsLoading(false);
        }
        fetchUserOverview();
    }, [userId]);

    if (isLoading) return (
        <div className="content">
            <h4 className="centred">Loading...</h4>
        </div>
    );

    if (!overview) return (
        <div className="content">
            <h4 className="centred">No data to return.</h4>
        </div>
    )

    const indoorColumns: GridColDef[] = [
        {
            field: "indoorClassification",
            headerName: "Indoor Classification",
            flex: 1,
            sortable: false,
            filterable: false,
            hideable: false,
            renderCell: () => (<IndoorClassification overview={overview} />)
        },
        {
            field: "indoorBadgeGiven",
            headerName: "Indoor Badge Given",
            flex: 1,
            sortable: false,
            filterable: false,
            hideable: false,
            renderCell: () => (<IndoorBadgeGiven overview={overview} />)
        },
        {
            field: "indoorHandicap",
            headerName: "Indoor Handicap",
            flex: 1,
            sortable: false,
            filterable: false,
            hideable: false,
            renderCell: () => (<IndoorHandicap overview={overview} />)
        },
    ]


    const outdoorColumns: GridColDef[] = [
        {
            field: "outdoorClassification",
            headerName: "Outdoor Classification",
            flex: 1,
            sortable: false,
            filterable: false,
            hideable: false,
            renderCell: () => (<OutdoorClassification overview={overview} />)
        },
        {
            field: "outdoorBadgeGiven",
            headerName: "Outdoor Badge Given",
            flex: 1,
            sortable: false,
            filterable: false,
            hideable: false,
            renderCell: () => (<OutdoorBadgeGiven overview={overview} />)
        },
        {
            field: "outdoorHandicap",
            headerName: "Outdoor Handicap",
            flex: 1,
            sortable: false,
            filterable: false,
            hideable: false,
            renderCell: () => (<OutdoorHandicap overview={overview} />)
        },
    ]

    const indoorRow = [{
        id: userId,
        indoorClassification: overview.indoorClassification,
        indoorBadgeGiven: overview.indoorBadgeGiven,
        indoorHandicap: overview.indoorHandicap,
    }];

    const outdoorRow = [{
        id: userId,
        outdoorClassification: overview.outdoorClassification,
        outdoorBadgeGiven: overview.outdoorBadgeGiven,
        outdoorHandicap: overview.outdoorHandicap,
    }];

    return (
        <>
            <h4>Indoors:</h4>
            <DataGrid
                rows={indoorRow}
                columns={indoorColumns}
                getRowHeight={() => "auto"}
            />

            <h4 style={{ marginTop: "1rem", marginBottom: "0.5rem" }}>Outdoors:</h4>
            <DataGrid
                rows={outdoorRow}
                columns={outdoorColumns}
                getRowHeight={() => "auto"}
            />

            <h4 style={{ marginTop: "1rem", marginBottom: "0.5rem" }}>Notes on user:</h4>
            <textarea
                value={notes}
                onChange={(event) => setNotes(event.target.value)}
                onBlur={(event: React.ChangeEvent<HTMLTextAreaElement>) => changeHandler(
                    "notes", event.target.value, overview, setNotes
                )}
                rows={10}
                style={{ width: "100%" }}
            />
        </>
    )
}