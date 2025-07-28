"use client";

import ScoreCard from './card';
import { Score } from './Score';
import { useEffect, useState, useRef } from 'react';

type ScorecardsProps = {
    userId: string;
    onDeletion?: () => Promise<void>;
};

export default function Scorecards({ userId, onDeletion }: ScorecardsProps) {
    const [scores, setScores] = useState<Score[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    
    const [page, setPage] = useState(1);
    const pageSize = 12;
    const [hasMore, setHasMore] = useState(false);
    const [totalPages, setTotalPages] = useState(1);

    const cacheRef = useRef<{ [page: number]: { scores: Score[]; hasMore: boolean; totalPages: number } }>({});

    const fetchUsersScores = async () => {
        setIsLoading(true);
        if (cacheRef.current[page]) {
            const cachedPage = cacheRef.current[page];
            setScores(cachedPage.scores);
            setHasMore(cachedPage.hasMore);
            setTotalPages(cachedPage.totalPages);
            setIsLoading(false);
            return;
        }

        const res = await fetch(`/api/scores/user/${userId}?page=${page}&pageSize=${pageSize}`);
        const data = await res.json();
        const scoresData = data.scores || data;
        const hasMoreData = data.hasMore !== undefined ? data.hasMore : (scoresData.length === pageSize);
        const totalPagesData = data.totalPages || 1;
        cacheRef.current[page] = {
            scores: scoresData,
            hasMore: hasMoreData,
            totalPages: totalPagesData
        };
        setScores(scoresData);
        setHasMore(hasMoreData);
        setTotalPages(totalPagesData);
        setIsLoading(false);
    };

    const handleDelete = async () => {
        if (onDeletion) {
            await onDeletion();
        }
        cacheRef.current = {};
        await fetchUsersScores();
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
                            <ScoreCard key={score.id} score={score} onDeletion={handleDelete} />
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
