import type { Playlist, Recommendation, Song } from "../types";

export const mockSongs: Song[] = [
  {
    id: "1",
    title: "Blinding Lights",
    artist: "The Weeknd",
    album: "After Hours",
    duration: "3:22",
    coverUrl:
      "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80",
    genre: ["Pop", "R&B"],
    isLiked: true,
  },
  {
    id: "2",
    title: "Flowers",
    artist: "Miley Cyrus",
    album: "Endless Summer Vacation",
    duration: "3:20",
    coverUrl:
      "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80",
    genre: ["Pop"],
    isLiked: false,
  },
  {
    id: "3",
    title: "Kill Bill",
    artist: "SZA",
    album: "SOS",
    duration: "2:33",
    coverUrl:
      "https://images.unsplash.com/photo-1511379938547-c1f69419868d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80",
    genre: ["R&B", "Hip Hop"],
    isLiked: true,
  },
  {
    id: "4",
    title: "As It Was",
    artist: "Harry Styles",
    album: "Harry's House",
    duration: "2:47",
    coverUrl:
      "https://images.unsplash.com/photo-1518609878373-06d740f60d8b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80",
    genre: ["Pop", "Rock"],
    isLiked: false,
  },
  {
    id: "5",
    title: "Anti-Hero",
    artist: "Taylor Swift",
    album: "Midnights",
    duration: "3:21",
    coverUrl:
      "https://images.unsplash.com/photo-1518609878373-06d740f60d8b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80",
    genre: ["Pop"],
    isLiked: true,
  },
  {
    id: "6",
    title: "Creepin",
    artist: "Metro Boomin, The Weeknd, 21 Savage",
    album: "HEROES & VILLAINS",
    duration: "3:42",
    coverUrl:
      "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80",
    genre: ["Hip Hop", "R&B"],
    isLiked: false,
  },
];

export const mockPlaylists: Playlist[] = [
  {
    id: "1",
    name: "Daily Mix 1",
    description: "The Weeknd, Drake, Post Malone and more",
    coverUrl:
      "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80",
    songCount: 30,
    creator: "SoundWave",
  },
  {
    id: "2",
    name: "Discover Weekly",
    description: "Your weekly mixtape of fresh music",
    coverUrl:
      "https://images.unsplash.com/photo-1511379938547-c1f69419868d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80",
    songCount: 25,
    creator: "SoundWave",
  },
  {
    id: "3",
    name: "Chill Vibes",
    description: "Relaxing tunes for your downtime",
    coverUrl:
      "https://images.unsplash.com/photo-1518609878373-06d740f60d8b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80",
    songCount: 40,
    creator: "SoundWave",
  },
  {
    id: "4",
    name: "Workout Energy",
    description: "High-energy tracks for your workout",
    coverUrl:
      "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80",
    songCount: 35,
    creator: "SoundWave",
  },
];

export const mockRecommendations: Recommendation[] = [
  {
    id: "1",
    name: "Made For You",
    description: "Your personal recommendations",
    songs: mockSongs.slice(0, 3),
    coverUrl:
      "https://images.unsplash.com/photo-1518609878373-06d740f60d8b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80",
  },
  {
    id: "2",
    name: "Popular Right Now",
    description: "Top tracks worldwide",
    songs: mockSongs.slice(2, 5),
    coverUrl:
      "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80",
  },
  {
    id: "3",
    name: "New Releases",
    description: "Fresh music just dropped",
    songs: mockSongs.slice(1, 4),
    coverUrl:
      "https://images.unsplash.com/photo-1511379938547-c1f69419868d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80",
  },
];
