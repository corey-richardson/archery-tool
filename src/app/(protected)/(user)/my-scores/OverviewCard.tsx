"use client";

import { useEffect, useState } from "react";
import { Overview } from "./Overview";
import { EnumMappings } from "@/app/lib/enumMappings";

const OverviewCard = ({ userId }: { userId: string }) => {
    const [ isLoading, setIsLoading ] = useState(true);

    const [ user, setUser ] = useState<{ name?: string }>({});
    const [ overview, setOverview ] = useState<Overview>();

    useEffect(() => {
        const fetchUserOverview = async () => {
            setIsLoading(true);
            let res = await fetch(`/api/users/${userId}`);
            let data = await res.json();
            setUser(data);
            res = await fetch(`/api/users/${userId}/scores/overview`);
            data = await res.json();
            setOverview(data);
            setIsLoading(false);
        }
        fetchUserOverview();
    }, [ userId ]);

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

    // TODO: Best scores

    return (
        <div className="wider content scorecard">
            <h2 style={{"paddingBottom": "1rem"}}>Hello, { user.name ?? "Unknown User" }.</h2>

            <div className="scorecard-flex">
                <div>
                    <p><b>Indoor Classification:</b> { overview.indoorClassification ? EnumMappings[overview.indoorClassification] : EnumMappings["UNCLASSIFIED"] }</p>
                    { overview.indoorBadgeGiven && <p><b>Indoor Badge Received:</b> { EnumMappings[overview.indoorBadgeGiven] || overview.indoorBadgeGiven }</p> }
                    { overview.indoorHandicap && <p><b>Indoor Handicap:</b> { overview.indoorHandicap }</p> }
                </div>

                <div>
                    <p><b>Outdoor Classification:</b> { overview.outdoorClassification ? EnumMappings[overview.outdoorClassification] : EnumMappings["UNCLASSIFIED"] }</p>
                    { overview.outdoorBadgeGiven && <p><b>Indoor Badge Received:</b> { EnumMappings[overview.outdoorBadgeGiven] || overview.outdoorBadgeGiven }</p> }
                    { overview.outdoorHandicap && <p><b>Indoor Handicap:</b> { overview.outdoorHandicap }</p> }
                </div>
            </div>
        </div>
    );
}

export default OverviewCard;
