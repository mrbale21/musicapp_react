// src/apis/models/models.ts
export interface Song {
  id: string;
  spotify_id?: string;
  title: string;
  artist: string;
  album: string;
  genre: string;
  image_url: string;
  preview_url: string;
  duration_ms: number;
  is_liked: boolean;
  danceability: number;
  energy: number;
  tempo: number;
  valence: number;
  acousticness: number;
  popularity?: number;
  key?: number;
  loudness?: number;
  mode?: number;
  speechiness?: number;
  instrumentalness?: number;
  liveness?: number;
  time_signature?: number;
  created_at?: string | Date;
  source_type?: string;
  youtube_id?: string;
  feature_vector?: number[];
}

export interface SongMetadata {
  custom_mp3_count: number;
  total: number;
}

export interface SongsListResponse {
  data: {
    metadata: SongMetadata;
    songs: Song[];
  };
}

export interface songResourceResponse {
  data: {
    source: string;
    video_id: string;
  };
  status: string;
}

export interface songByIdResponse {
  message?: string;
  status: string;
  data: Song;
}

export interface PopularSongsResponse {
  data: {
    limit: number;
    songs: Song[];
  };
}

export interface ContentRecommendationResponse {
  data: {
    count: number;
    metadata: {
      max_recommendation: string;
    };
    recommendations: RecommendationItem[];
  };
}

export interface collabRecommendationResponse {
  data: {
    count: number;
    recommendations: RecommendationItem[];
  };
}

export interface hybridRecommendationResponse {
  data: {
    algorithm_info: string;
    count: number;
    recommendations: RecommendationItem[];
  };
}

export type RecommendationScoreType = "content" | "collaborative" | "hybrid";

export interface RecommendationItem {
  song: Song;
  score: number;
  score_type: RecommendationScoreType;
  explanation?: string;
  rank: number;
}

export interface ApiResponse<T = any> {
  status: string;
  message: string;
  data: T;
}
