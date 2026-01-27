import React from "react";
import type { Playlist } from "../types";

interface PlaylistCardProps {
  playlist: Playlist;
  onClick: () => void;
}

const PlaylistCard: React.FC<PlaylistCardProps> = ({ playlist, onClick }) => {
  return (
    <div
      className="bg-spotify-light-dark rounded-2xl p-4 hover:bg-spotify-light-gray transition-colors cursor-pointer hover-scale"
      onClick={onClick}
    >
      <div className="relative mb-4">
        <div className="w-full aspect-square rounded-xl overflow-hidden">
          <img
            src={playlist.coverUrl}
            alt={playlist.name}
            className="w-full h-full object-cover"
          />
        </div>
        <div className="absolute bottom-2 right-2 w-10 h-10 bg-spotify-green rounded-full flex items-center justify-center shadow-lg">
          <i className="fas fa-play text-black"></i>
        </div>
      </div>

      <h3 className="text-white font-bold truncate mb-1">{playlist.name}</h3>
      <p className="text-spotify-gray text-sm truncate mb-2">
        {playlist.description}
      </p>
      <div className="flex items-center justify-between">
        <span className="text-spotify-gray text-xs">
          {playlist.songCount} songs
        </span>
        <span className="text-spotify-gray text-xs">By {playlist.creator}</span>
      </div>
    </div>
  );
};

export default PlaylistCard;
