"use client";

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';

type Club = {
    id: string;
    name: string;
    createdAt: string;
};

type Member = {
    id: string;
    userId: string;
    clubId: string;
    roles: string[];
    joinedAt: string;
    endedAt: string | null;
    user: {
        id: string;
        name: string;
        email: string;
    };
};

type ClubData = {
    club: Club;
    members: Member[];
};

const ClubOverview = () => {
    const params = useParams();
    const clubId = params.clubId as string;
    
    const [clubData, setClubData] = useState<ClubData | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchClubData = async () => {
        try {
            const response = await fetch(`/api/club/${clubId}`);
            
            if (!response.ok) {
                throw new Error(`Failed to fetch club data: ${response.status}`);
            }
            
            const data = await response.json();
            setClubData(data);
            
        } catch (err) {
            setError(err instanceof Error ? err.message : 'An error occurred');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        if (clubId) {
            fetchClubData();
        }
    }, [clubId]);

    if (isLoading) {
        return (
            <div className="content">
                <p className="centred">Loading club information...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="content">
                <h3>Error</h3>
                <p className="centred">Failed to load club: {error}</p>
            </div>
        );
    }

    if (!clubData) {
        return (
            <div className="content">
                <h3>Club Not Found</h3>
                <p className="centred">The requested club could not be found.</p>
            </div>
        );
    }

    const { club } = clubData;

    return (
        <div className="content">
            <h3>{ club.name }</h3>
        </div>
    );
};
 
export default ClubOverview;
