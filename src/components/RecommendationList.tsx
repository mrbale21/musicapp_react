// components/RecommendationList.tsx
import React from "react";
import type { Song } from "../apis/models/song";

interface RecommendationListProps {
  recommendation: {
    id: string;
    name: string;
    description: string;
    coverUrl: string;
    songs: Song[];
  };
  playingSongId: string | null;
  isPlaying: boolean;
  onPlaySong: (songId: string) => void;
  onToggleLike: (songId: string) => void;
}

const RecommendationList: React.FC<RecommendationListProps> = ({
  recommendation,
  playingSongId,
  isPlaying,
  onPlaySong,
  onToggleLike,
}) => {
  if (!recommendation.songs || recommendation.songs.length === 0) {
    return null;
  }

  return (
    <div className="mb-8">
      <div className="flex items-center justify-between mb-3">
        <div>
          <h3 className="text-lg font-bold text-white">
            {recommendation.name}
          </h3>
          <p className="text-spotify-gray text-sm">
            {recommendation.description}
          </p>
        </div>
        <button className="text-spotify-gray hover:text-white text-sm font-medium">
          See all
        </button>
      </div>

      <div className="flex space-x-4 overflow-x-auto pb-4">
        {recommendation.songs.map((song) => (
          <div
            key={song.id}
            className="min-w-[150px] bg-spotify-light-dark rounded-lg p-4 hover:bg-spotify-light-gray transition-colors"
          >
            <div className="relative mb-3">
              <img
                src={song.image_url || "https://via.placeholder.com/150"}
                alt={song.title}
                className="w-full aspect-square rounded-md object-cover"
              />
              <button
                onClick={() => onPlaySong(song.id)}
                className="absolute bottom-2 right-2 w-10 h-10 rounded-full bg-spotify-green flex items-center justify-center opacity-0 hover:opacity-100 transform hover:scale-105 transition-all"
              >
                <i
                  className={`fas ${
                    playingSongId === song.id && isPlaying
                      ? "fa-pause"
                      : "fa-play"
                  } text-white`}
                ></i>
              </button>
            </div>
            <h4 className="text-white font-medium truncate">{song.title}</h4>
            <p className="text-spotify-gray text-sm truncate">{song.artist}</p>
            <div className="flex items-center justify-between mt-2">
              <button
                onClick={() => onToggleLike(song.id)}
                className="text-spotify-gray hover:text-spotify-green"
              >
                <i
                  className={`fas ${
                    song.is_liked ? "fa-heart text-spotify-green" : "fa-heart"
                  }`}
                ></i>
              </button>
              <span className="text-spotify-gray text-xs">
                {Math.floor((song.duration_ms || 0) / 60000)}:
                {Math.floor(((song.duration_ms || 0) % 60000) / 1000)
                  .toString()
                  .padStart(2, "0")}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RecommendationList;
