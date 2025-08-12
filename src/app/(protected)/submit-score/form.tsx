"use client";

import calculateAgeCategory from "@/app/lib/calculateAgeCategory";
import React, { useEffect, useState, useRef, useMemo, useCallback } from "react";
import { EnumMappings } from "@/app/lib/enumMappings";
import { redirect } from "next/navigation";


// Constants
const TODAY = new Date();

const ScoreSubmissionForm = ({userId} : any) => {
    // State
    const [ isLoading, setIsLoading ] = useState(false);
    const [ availableRounds, setAvailableRounds ] = useState<{name: string, body: string}[]>([]);
    const [ loadingRounds, setLoadingRounds ] = useState(false);
    const [ roundsLoadError, setRoundsLoadError ] = useState(false);

    const [ dateShot, setDateShot ] = useState(TODAY);
    const [ roundName, setRoundName ] = useState("");
    const [ roundType, setRoundType ] = useState("INDOOR");
    const [ bowstyle, setBowstyle ] = useState("");
    const [ competitionLevel, setCompetitionLevel ] = useState("PRACTICE");
    const [ score, setScore ] = useState("");
    const [ xs, setXs ] = useState("");
    const [ tens, setTens ] = useState("");
    const [ nines, setNines ] = useState("");
    const [ hits, setHits ] = useState("");
    const [ notes, setNotes ] = useState("");
    const [ ageCategory, setAgeCategory ] = useState("SENIOR");
    const [ sex, setSex ] = useState("NOT_SET");


    // Refs for caching
    const roundsCache = useRef<{[key: string]: {name: string, body: string}[]}>({});
    const userDataRef = useRef<{defaultBowstyle: string, ageCategory: string, sex: string} | null>(null);
    const fetchingRounds = useRef<string | null>(null);


    // Effects
    useEffect(() => {
        async function fetchUser() {

            if (userDataRef.current) {
                setBowstyle(userDataRef.current.defaultBowstyle);
                setAgeCategory(userDataRef.current.ageCategory);
                setSex(userDataRef.current.sex);
                return;
            }

            const res = await fetch(`/api/user/${userId}`);
            const data = await res.json();
            const ageCategory = calculateAgeCategory(data.yearOfBirth);

            userDataRef.current = {
                defaultBowstyle: data.defaultBowstyle,
                ageCategory: ageCategory,
                sex: data.sex,
            };

            setBowstyle(data.defaultBowstyle);
            setSex(data.sex);
            setAgeCategory(ageCategory);
        }
        fetchUser();

    }, [ userId ]);


    // Fetch rounds when round type changes
    const fetchRounds = useCallback(async (type: string) => {

        if (roundsCache.current[type]) {
            setAvailableRounds(roundsCache.current[type]);
            setLoadingRounds(false);
            setRoundsLoadError(false);
            return;
        }

        if (fetchingRounds.current === type) {
            return;
        }

        fetchingRounds.current = type;
        setLoadingRounds(true);
        setRoundsLoadError(false);

        try {
            const res = await fetch(`/api/rounds?type=${type}`);
            const data = await res.json();
            if (res.ok) {
                // Cache the results
                roundsCache.current[type] = data.rounds;
                setAvailableRounds(data.rounds);
                setRoundsLoadError(false);
            } else {
                console.error("Error fetching rounds:", data.error);
                setAvailableRounds([]);
                setRoundsLoadError(true);
            }

        } catch (error) {
            console.error("Error fetching rounds:", error);
            setAvailableRounds([]);
            setRoundsLoadError(true);
        } finally {
            setLoadingRounds(false);
            fetchingRounds.current = null;
        }
    }, []);

    useEffect(() => {
        if (!roundType) return;

        fetchRounds(roundType);
        setRoundName("");
    }, [ roundType, fetchRounds ]);


    const bowstyleOptions = useMemo(() => [
        { value: "BAREBOW", label: EnumMappings["BAREBOW"] },
        { value: "RECURVE", label: EnumMappings["RECURVE"] },
        { value: "COMPOUND", label: EnumMappings["COMPOUND"] },
        { value: "LONGBOW", label: EnumMappings["LONGBOW"] },
        { value: "TRADITIONAL", label: EnumMappings["TRADITIONAL"] },
        { value: "OTHER", label: EnumMappings["OTHER"] }
    ], []);


    const competitionLevelOptions = useMemo(() => [
        { value: "PRACTICE", label: EnumMappings["PRACTICE"] },
        { value: "CLUB_EVENT", label: EnumMappings["CLUB_EVENT"] },
        { value: "OPEN_COMPETITION", label: EnumMappings["OPEN_COMPETITION"] },
        { value: "RECORDSTATUS_COMPETITION", label: EnumMappings["RECORDSTATUS_COMPETITION"] }
    ], []);


    const roundTypeOptions = useMemo(() => [
        { value: "INDOOR", label: EnumMappings["INDOOR"] },
        { value: "OUTDOOR", label: EnumMappings["OUTDOOR"] }
    ], []);


    // Handlers
    const handleSubmit = async(e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        const submittedAt = new Date();

        const res = await fetch("/api/scores", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ userId, ageCategory, sex, submittedAt, dateShot, roundName, roundType, bowstyle, score, xs, tens, nines, hits, competitionLevel, notes }),
        });

        if (res.ok) {
            setDateShot(TODAY);
            setRoundName("");
            setRoundType("INDOOR");
            setBowstyle("");
            setCompetitionLevel("PRACTICE");
            setScore("");
            setXs("");
            setTens("");
            setNines("");
            setHits("");
            setNotes("");

            setIsLoading(false);
            redirect("/my-scores");
        }
    }

    // Render
    return (
        <div className="wider content">
            <form className="flex-form" onSubmit={handleSubmit}>
                <div className="flex-form-row">
                    <label>Date Shot:</label>
                    <input
                        type="date"
                        value={ dateShot.toISOString().slice(0, 10) }
                        onChange={e => setDateShot(new Date(e.target.value))}
                        required
                    />

                    <label>Round Type:</label>
                    <select value={roundType} onChange={e => setRoundType(e.target.value)} required>
                        {roundTypeOptions.map((option) => (
                            <option key={option.value} value={option.value}>
                                {option.label}
                            </option>
                        ))}
                    </select>

                    <label>Round Name:</label>
                    <input
                        type="text"
                        value={roundName}
                        onChange={e => setRoundName(e.target.value)}
                        placeholder={loadingRounds ? "Loading rounds..." : "Enter Round Name"}
                        disabled={loadingRounds}
                        required
                        list="rounds-datalist"
                    />
                    {!roundsLoadError && !loadingRounds && availableRounds.length > 0 && (
                        <datalist id="rounds-datalist">
                            {availableRounds.map((round) => (
                                <option key={round.name} value={round.name} />
                            ))}
                        </datalist>
                    )}
                </div>

                <div className="flex-form-row">
                    <label>Bowstyle:</label>
                    <select value={bowstyle ?? ""} onChange={e => setBowstyle(e.target.value)} autoComplete="on" required>
                        <option disabled value="">Please Select</option>
                        {bowstyleOptions.map((option) => (
                            <option key={option.value} value={option.value}>
                                {option.label}
                            </option>
                        ))}
                    </select>

                    <label>Competition Level:</label>
                    <select value={competitionLevel} onChange={e => setCompetitionLevel(e.target.value)} required>
                        {competitionLevelOptions.map((option) => (
                            <option key={option.value} value={option.value}>
                                {option.label}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="flex-form-row">
                    <label>Score:</label>
                    <input type="number" step="1" value={score} onChange={e => setScore(e.target.value)} required/>

                    <label>Xs:</label>
                    <input type="number" step="1" value={xs} onChange={e => setXs(e.target.value)} />

                    <label>Xs + Tens:</label>
                    <input type="number" step="1" value={tens} onChange={e => setTens(e.target.value)} />

                    <label>Nines:</label>
                    <input type="number" step="1" value={nines} onChange={e => setNines(e.target.value)} />

                    <label>Hits:</label>
                    <input type="number" step="1" value={hits} onChange={e => setHits(e.target.value)} />
                </div>

                <div className="flex-form-row">
                    <label>Notes:</label>
                    <textarea value={notes} onChange={e => setNotes(e.target.value)} placeholder="Add any extra details about the score here."></textarea>
                </div>

                {!isLoading && <button type="submit">Submit Score</button> }
                {isLoading && <button disabled>Submitting...</button> }
            </form>
        </div>
    );
}

export default ScoreSubmissionForm;
