"use client";

import ScoreCard from './card';
import { Score } from './Score';
import { useEffect, useState } from 'react';

type ScorecardsProps = {
    userId: string;
    onDeletion?: () => Promise<void>;
};

export default function Scorecards({ userId, onDeletion }: ScorecardsProps) {
    const [scores, setScores] = useState<Score[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [page, setPage] = useState(1);
    const pageSize = 24;
    const [hasMore, setHasMore] = useState(false);
    const [totalPages, setTotalPages] = useState(1);

    const fetchUsersScores = async () => {
        setIsLoading(true);
        const res = await fetch(`/api/scores/user/${userId}?page=${page}&pageSize=${pageSize}`);
        const data = await res.json();

        setScores(data.scores || data);
        setHasMore(data.hasMore !== undefined ? data.hasMore : (data.length === pageSize));
        setTotalPages(data.totalPages || 1);
        setIsLoading(false);
    };

    useEffect(() => {
        fetchUsersScores();
    }, [userId, page]);

    const handlePrev = () => {
        if (page > 1) setPage(page - 1);
    };
    const handleNext = () => {
        if (hasMore) setPage(page + 1);
    };

    return (
        <>
            { isLoading && (
                <div className="content">
                    <h4 className="centred">Loading...</h4>
                </div>
            )}

            { !isLoading && scores.length == 0 && (
                <div className="content">
                    <h4 className="centred">You don't have any scores yet!</h4>
                </div>
            )}

            { !isLoading && scores.length > 0 && (
                <>
                    <div className="scorecard-list">
                        {scores.map((score: Score) => (
                            <ScoreCard key={score.id} score={score} onDeletion={fetchUsersScores} />
                        ))}
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', margin: '2rem 0', alignItems: 'center' }}>
                        <button className="btn-navigation" onClick={handlePrev} disabled={page === 1 || isLoading}>&lt; Previous</button>
                        <p className="small">Page {page} of {totalPages}</p>
                        <button className="btn-navigation" onClick={handleNext} disabled={!hasMore || isLoading}>Next &gt;</button>
                    </div>
                </>
            )}
        </>
    );
}
