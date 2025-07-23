"use client";

import React from "react";
import { Score } from './Score';
import { EnumMappings } from "@/app/lib/enumMappings";

const ScoreCard = ({ score } : { score: Score }) => {
    return (  
        <div className="wider scorecard">
            <div className="scorecard-header">
              <h4>{score.roundName} <span className="small">({score.roundType})</span></h4>
              <span className="scorecard-date">{new Date(score.dateShot).toLocaleDateString("en-GB")}</span>
            </div>
            <div className="scorecard-main">
              <div>
                <b>Score:</b> {score.score}
                {score.xs && <span> | Xs: {score.xs}</span>}
                {score.tens && <span> | 10s: {score.tens}</span>}
                {score.nines && <span> | 9s: {score.nines}</span>}
                {score.hits && <span> | Hits: {score.hits}</span>}
              </div>
              <div>
                <b>Bowstyle:</b> {EnumMappings[score.bowstyle] || score.bowstyle} | <b>Age Category:</b> {EnumMappings[score.ageCategory] || score.ageCategory}
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
            {score.submittedAt && (
              <div className="scorecard-footer small">
                Submitted: {new Date(score.submittedAt).toLocaleString("en-GB")}
                { score.processedAt &&  
                  <span> | Processed by Records Officer: {new Date(score.processedAt).toLocaleString("en-GB")}</span>
                }
              </div>
            )}
        </div>
    );
}
 
export default ScoreCard
