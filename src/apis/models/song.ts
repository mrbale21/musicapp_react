import type { AudioFeatures } from "./audiofeat";

export interface SongsRes {
  mp3_file?: File | string;
  song_id?: string;
  data: Song[];
}
// models/Song.ts
export interface Song {
  id: string;
  spotify_id: string;
  title: string;
  artist: string;
  album: string;
  genre: string;
  popularity: number;
  duration_ms: number;
  danceability: number;
  energy: number;
  key: number;
  loudness: number;
  mode: number;
  speechiness: number;
  acousticness: number;
  instrumentalness: number;
  is_liked: string;
  liveness: number;
  valence: number;
  tempo: number;
  time_signature: number;
  preview_url: string;
  image_url: string;
  created_at: string | Date;
  feature_vector?: number[];
  youtube_id?: string;
}

// models/SongWithFeatures.ts (optional - combined)
export interface SongWithFeatures extends Song, AudioFeatures {}
