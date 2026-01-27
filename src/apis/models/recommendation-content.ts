// types/recommendation.ts

import type { Song } from "./song";

export interface RecommendationItem {
  song: Song;
  score: number;
  score_type: string;
  explanation: string;
  rank: number;
}

export interface RecommendationResponse {
  data: {
    count: number;
    metadata: {
      max_recommendations: number;
    };
    recommendations: RecommendationItem[];
    song_id?: string;
    type: string;
  };
  message: string;
  status: string;
}
