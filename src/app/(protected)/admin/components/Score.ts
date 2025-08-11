export type Score = {
  id: string;
  user: {
    id: string;
    name: string;
    email: string;
  };
  ageCategory: string;
  sex?: string;
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
  roundClassification?: string;
  roundIndoorClassification?: string;
  roundOutdoorClassification?: string;
  roundHandicap?: number;
  notes?: string;
  processedAt?: string;
};
