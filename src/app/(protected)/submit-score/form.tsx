"use client";

import { useEffect, useState } from "react";

const TODAY = new Date();

const ScoreSubmissionForm = ({userId} : any) => {

    const [ dateShot, setDateShot ] = useState(TODAY);
    const [ roundName, setRoundName ] = useState("");
    const [ roundType, setRoundType ] = useState("INDOOR");
    const [ bowstyle, setBowstyle ] = useState("");
    const [ competitionLevel, setCompetitionLevel ] = useState("PRACTICE");
    const [ score, setScore ] = useState(0);
    const [ xs, setXs ] = useState(0);
    const [ tens, setTens ] = useState(0);
    const [ nines, setNines ] = useState(0);
    const [ hits, setHits ] = useState(0);
    const [ notes, setNotes ] = useState("");

    useEffect(() => {
        async function fetchUser() {
            const res = await fetch(`/api/user?userId=${userId}`);
            const data = await res.json();
            console.log(data);
            setBowstyle(data.defaultBowstyle);
            console.log(bowstyle);
        }
        fetchUser();
        
    }, [userId]);

    return ( 
        <div className="wider content">
            <h3>Submit a Score to the Records Officer</h3>
            <p className="centred">Lorem ipsum dolor sit amet consectetur adipisicing elit. In quidem et molestiae, ea libero, fugiat dolore veniam provident hic vel veritatis eum quia, perspiciatis at doloribus! Soluta eius sequi illo!</p>
            <form className="flex-form">
               <div className="flex-form-row">
                    <label>Date Shot:</label>
                    <input
                        type="date"
                        value={ dateShot.toISOString().slice(0, 10) }
                        onChange={e => setDateShot(new Date(e.target.value))}
                    />

                    <label>Round Name:</label>
                    <input value={roundName ?? ""} onChange={e => setRoundName(e.target.value)} />
               
                    <label>Round Type:</label>
                    <select value={roundType} onChange={e => setRoundType(e.target.value)}>
                        <option value="INDOOR">Indoor</option>
                        <option value="OUTDOOR">Outdoor</option>
                    </select>
               </div>

               <div className="flex-form-row">
                    <label>Bowstyle:</label>
                    <select value={bowstyle ?? ""} onChange={e => setBowstyle(e.target.value)}>
                        <option disabled value="">Please Select</option>
                        <option value="BAREBOW">Barebow</option>
                        <option value="RECURVE">Recurve</option>
                        <option value="COMPOUND">Compound</option>
                        <option value="LONGBOW">Longbow</option>
                        <option value="TRADITIONAL">Traditional</option>
                        <option value="OTHER">Other</option>
                    </select>

                    <label>Competition Level:</label>
                    <select value={competitionLevel} onChange={e => setCompetitionLevel(e.target.value)}>
                        <option value="PRACTICE">Club Practice</option>
                        <option value="CLUB_EVENT">Club Target Day / Club Event</option>
                        <option value="OPEN_COMPETITION">Open Competition</option>
                        <option value="RECORDSTATUS_COMPETITION">Record Status Competition</option>
                    </select>
               </div>

               <div className="flex-form-row">
                    <label>Score:</label>
                    <input type="number" step="1" value={score} onChange={e => setScore(Number(e.target.value))} />

                    <label>Xs:</label>
                    <input type="number" step="1" value={xs} onChange={e => setXs(Number(e.target.value))} />

                    <label>Tens:</label>
                    <input type="number" step="1" value={tens} onChange={e => setTens(Number(e.target.value))} />

                    <label>Nines:</label>
                    <input type="number" step="1" value={nines} onChange={e => setNines(Number(e.target.value))} />

                    <label>Hits:</label>
                    <input type="number" step="1" value={hits} onChange={e => setHits(Number(e.target.value))} />
               </div>

               <div className="flex-form-row">
                    <label>Notes:</label>
                    <textarea value={notes} onChange={e => setNotes(e.target.value)} placeholder="Add any extra details about the score here."></textarea>
               </div>

               <button type="submit">Submit Score</button>
            </form>
        </div>
     );
}
 
export default ScoreSubmissionForm;