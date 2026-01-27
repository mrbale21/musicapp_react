import type { RecommendationItem, Song } from "../apis/models/models";

export const mockSongs: Song[] = [
  {
    id: "1",
    title: "Blinding Lights",
    artist: "The Weeknd",
    album: "After Hours",
    genre: "Pop",
    image_url:
      "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=400&fit=crop",
    preview_url: "",
    duration_ms: 200000,
    is_liked: true,
    danceability: 0.514,
    energy: 0.73,
    tempo: 171,
    valence: 0.334,
    acousticness: 0.001,
  },
  {
    id: "2",
    title: "Levitating",
    artist: "Dua Lipa",
    album: "Future Nostalgia",
    genre: "Pop",
    image_url:
      "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=400&h=400&fit=crop",
    preview_url: "",
    duration_ms: 203000,
    is_liked: false,
    danceability: 0.702,
    energy: 0.825,
    tempo: 103,
    valence: 0.915,
    acousticness: 0.003,
  },
  {
    id: "3",
    title: "Starboy",
    artist: "The Weeknd",
    album: "Starboy",
    genre: "R&B",
    image_url:
      "https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=400&h=400&fit=crop",
    preview_url: "",
    duration_ms: 230000,
    is_liked: true,
    danceability: 0.679,
    energy: 0.587,
    tempo: 186,
    valence: 0.486,
    acousticness: 0.014,
  },
  {
    id: "4",
    title: "Good 4 U",
    artist: "Olivia Rodrigo",
    album: "SOUR",
    genre: "Pop Rock",
    image_url:
      "https://images.unsplash.com/photo-1514320291840-2e0a9bf2a9ae?w=400&h=400&fit=crop",
    preview_url: "",
    duration_ms: 178000,
    is_liked: false,
    danceability: 0.563,
    energy: 0.664,
    tempo: 166,
    valence: 0.688,
    acousticness: 0.086,
  },
];

export const mockRecommendations: RecommendationItem[] = mockSongs
  .slice(1)
  .map((song, idx) => ({
    song,
    score: 0.85 - idx * 0.1,
    score_type: "content" as const,
    explanation: `Similar energy (${(song.energy * 100).toFixed(
      0
    )}%) and tempo (${song.tempo.toFixed(0)} BPM)`,
    rank: idx + 1,
  }));
