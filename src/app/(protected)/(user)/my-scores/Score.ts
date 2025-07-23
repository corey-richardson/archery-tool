export type Score = {
    id: string;
    dateShot: string;
    roundName: string;
    roundType: string;
    bowstyle: string;
    score: number;
    xs?: number;
    tens?: number;
    nines?: number;
    hits?: number;
    competitionLevel: string;
    ageCategory: string;
    notes?: string;
    submittedAt?: string;
    processedAt?:string;
}
