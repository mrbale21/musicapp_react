import type { Song } from "./song";

// models/UserLike.ts
export interface UserLike {
  id: number;
  user_id: number;
  song_id: string;
  created_at: string | Date;

  // Relationships
  song?: Song;
}

// models/UserPlay.ts
export interface UserPlay {
  id: number;
  user_id: number;
  song_id: string;
  play_count: number;
  last_played: string;
  created_at: string;

  // Relationships
  song?: Song;
}

// models/RecommendationScore.ts
export interface RecommendationScore {
  song: Song;
  score: number;
  score_type: "content" | "collaborative" | "hybrid";
  explanation?: string;
  rank?: number;
}
