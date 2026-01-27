export interface User {
  id: string;
  name: string;
  email: string;
  avatar: string;
}

export interface Song {
  id: string;
  title: string;
  artist: string;
  album: string;
  duration: string;
  coverUrl: string;
  genre: string[];
  isLiked: boolean;
}

export interface Playlist {
  id: string;
  name: string;
  description: string;
  coverUrl: string;
  songCount: number;
  creator: string;
}

export interface Recommendation {
  id: string;
  name: string;
  description: string;
  songs: Song[];
  coverUrl: string;
}
