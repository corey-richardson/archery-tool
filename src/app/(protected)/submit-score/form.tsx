"use client";

import calculateAgeCategory from "@/app/lib/calculateAgeCategory";
import React, { useEffect, useState } from "react";
import { EnumMappings } from "@/app/lib/enumMappings";
import { redirect } from "next/navigation";

// Constants
const TODAY = new Date();

const ScoreSubmissionForm = ({userId} : any) => {
    // State
    const [ isLoading, setIsLoading ] = useState(false);

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
    const [ ageCategory, setAgeCategory] = useState("SENIOR");

    // Effects
    useEffect(() => {
        async function fetchUser() {
            const res = await fetch(`/api/user/${userId}`);
            const data = await res.json();
            setBowstyle(data.defaultBowstyle);
            setAgeCategory(calculateAgeCategory(data.yearOfBirth));
        }
        fetchUser();
        
    }, [userId]);

    // Handlers
    const handleSubmit = async(e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        const submittedAt = new Date();

        const res = await fetch("/api/scores", {
            method: "POST",
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ userId, ageCategory, submittedAt, dateShot, roundName, roundType, bowstyle, score, xs, tens, nines, hits, competitionLevel, notes }),
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

                    <label>Round Name:</label>
                    <input value={roundName ?? ""} onChange={e => setRoundName(e.target.value)} required/>
               
                    <label>Round Type:</label>
                    <select value={roundType} onChange={e => setRoundType(e.target.value)} required>
                        <option value="INDOOR">{ EnumMappings["INDOOR"] }</option>
                        <option value="OUTDOOR">{ EnumMappings["OUTDOOR"] }</option>
                    </select>
               </div>

               <div className="flex-form-row">
                    <label>Bowstyle:</label>
                    <select value={bowstyle ?? ""} onChange={e => setBowstyle(e.target.value)} required>
                        <option disabled value="">Please Select</option>
                        <option value="BAREBOW">{ EnumMappings["BAREBOW"] }</option>
                        <option value="RECURVE">{ EnumMappings["RECURVE"] }</option>
                        <option value="COMPOUND">{ EnumMappings["COMPOUND"] }</option>
                        <option value="LONGBOW">{ EnumMappings["LONGBOW"] }</option>
                        <option value="TRADITIONAL">{ EnumMappings["TRADITIONAL"] }</option>
                        <option value="OTHER">{ EnumMappings["OTHER"] }</option>
                    </select>

                    <label>Competition Level:</label>
                    <select value={competitionLevel} onChange={e => setCompetitionLevel(e.target.value)} required>
                        <option value="PRACTICE">{ EnumMappings["PRACTICE"] }</option>
                        <option value="CLUB_EVENT">{ EnumMappings["CLUB_EVENT"] }</option>
                        <option value="OPEN_COMPETITION">{ EnumMappings["OPEN_COMPETITION"] }</option>
                        <option value="RECORDSTATUS_COMPETITION">{ EnumMappings["RECORDSTATUS_COMPETITION"] }</option>
                    </select>
               </div>

               <div className="flex-form-row">
                    <label>Score:</label>
                    <input type="number" step="1" value={score} onChange={e => setScore(e.target.value)} required/>

                    <label>Xs:</label>
                    <input type="number" step="1" value={xs} onChange={e => setXs(e.target.value)} />

                    <label>Tens:</label>
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
