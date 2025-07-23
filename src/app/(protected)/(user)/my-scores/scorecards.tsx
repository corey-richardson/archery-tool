"use client";

import ScoreCard from './card';
import { Score } from './Score';
import { useEffect, useState } from 'react';

type ScorecardsProps = {
    userId: string;
};

export default function Scorecards({ userId }: ScorecardsProps) {

    const [ scores, setScores ] = useState([]);

    useEffect(() => {
        async function fetchUsersScores() {
            const res = await fetch(`/api/scores/user/${userId}`);
            const data = await res.json();
            setScores(data);
        }

        fetchUsersScores();
    }, [userId]);

    return (
        <>
            {scores.map((score: Score) => {
                return <ScoreCard key={score.id} score={score} />;
            })}
        </>
    );
}
