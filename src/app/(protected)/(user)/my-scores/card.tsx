"use client";

import React from "react";
import { Score } from './Score';
import { EnumMappings } from "@/app/lib/enumMappings";
import { useState } from "react";

const ScoreCard = ({ score, onDeletion } : { score: Score; onDeletion?: () => void }) => {
    const [ isDeleting, setIsDeleting ] = useState(false);

    const handleDeleteScore = async (scoreId: string) => {
        setIsDeleting(true);
        const response = await fetch(`/api/scores/score/${scoreId}`, {
            method: "DELETE",
        });

        if (response.ok) {
            setIsDeleting(false);
            if (onDeletion) { onDeletion(); }
        }
    }

    return (  
        <div className="wider scorecard scorecard-flex">
          <div>
            <h4>{ score.roundName } <span className="small">| { new Date(score.dateShot).toLocaleDateString() } ({ EnumMappings[score.roundType] || score.roundType })</span></h4>
            <p><b>Score:</b> {score.score}</p>
            <div>
              <span> <b>Xs:</b> {score.xs || "-"} | </span>
              <span> <b>10s:</b> {score.tens || "-"} | </span>
              <span> <b>9s:</b> {score.nines || "-"} | </span>
              <span> <b>Hits:</b> {score.hits || "-"} </span>
            </div>
            <div>
              <b>Bowstyle:</b> {EnumMappings[score.bowstyle] || score.bowstyle} |&nbsp;
              <b>Age Category:</b> {EnumMappings[score.ageCategory] || score.ageCategory}
            </div>
            <div>
              <b>Competition:</b> {EnumMappings[score.competitionLevel] || score.competitionLevel}
            </div>
            {score.notes && (
              <div className="scorecard-notes">
                <b>Notes:</b> {score.notes}
              </div>
            )}
          </div>
          <div>
            <div>
                {score.roundIndoorClassification && (
                    <p>
                    <b>Classification:</b> {EnumMappings[score.roundIndoorClassification] || score.roundIndoorClassification}
                    </p>
                )}

                {score.roundOutdoorClassification && (
                    <p>
                    <b>Classification:</b> {EnumMappings[score.roundOutdoorClassification] || score.roundOutdoorClassification}
                    </p>
                )}

                {score.roundHandicap && (
                    <p>
                    <b>Handicap:</b> {score.roundHandicap}
                    </p>
                )}

                { (score.roundIndoorClassification || score.roundOutdoorClassification || score.roundHandicap) && <br/> }
            </div>

            <div>
                <p className="small">Submitted at: {score.submittedAt ? new Date(score.submittedAt).toLocaleString("en-GB") : "-"}</p>
                <p className="small">{score.processedAt ? "Processed at: " + new Date(score.processedAt).toLocaleString("en-GB") : "Waiting for Records Officer to process"}</p>
            </div>

            { onDeletion && (
              <div>
                  <br />
                  { !isDeleting && <button className="btn-navigation"  style={{"textDecoration": "underline", "padding": "0"}} onClick={() => handleDeleteScore(score.id)}>Delete</button> }
                  { isDeleting && <button className="btn-navigation" disabled>Deleting...</button> }
              </div>
            )}

          </div>
        </div>
    );
}
 
export default ScoreCard
