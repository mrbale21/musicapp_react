// components/SongCard.tsx
import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import type { Song } from "../apis/models/song";

interface SongCardProps {
  song: Song;
  isPlaying: boolean;
  onPlay: (song: Song) => void;
  onToggleLike: (songId: string) => void;
}

const SongCard: React.FC<SongCardProps> = ({ song }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [localIsPlaying, setLocalIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const navigate = useNavigate();

  // Cek apakah song memiliki preview audio
  const hasPreview = song.preview_url && song.preview_url !== "";

  // Format duration
  const formatDuration = (ms: number) => {
    const minutes = Math.floor(ms / 60000);
    const seconds = Math.floor((ms % 60000) / 1000);
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };

  // Handle play/pause
  const handlePlay = () => {
    if (hasPreview) {
      if (audioRef.current) {
        if (localIsPlaying) {
          audioRef.current.pause();
          setLocalIsPlaying(false);
        } else {
          audioRef.current.play();
          setLocalIsPlaying(true);
        }
      } else {
        // Buat audio element baru
        const audio = new Audio(song.preview_url);
        audioRef.current = audio;
        audio.play();
        setLocalIsPlaying(true);

        audio.onended = () => {
          setLocalIsPlaying(false);
          audioRef.current = null;
        };
      }
    } else {
      // Fallback ke YouTube atau eksternal
      const searchQuery = encodeURIComponent(
        `${song.title} ${song.artist} official audio`,
      );
      window.open(
        `https://www.youtube.com/results?search_query=${searchQuery}`,
        "_blank",
      );
    }
  };

  // Cleanup audio on unmount
  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  const handleCardClick = (e: React.MouseEvent) => {
    // Hanya navigasi jika tidak mengklik button
    if (!(e.target as HTMLElement).closest("button")) {
      navigate(`/songdetail/${song.id}`);
    }
  };

  return (
    <div
      className="flex items-center justify-between p-3 hover:bg-spotify-light-dark/50 rounded-lg transition-colors group"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={handleCardClick}
    >
      <div className="flex items-center flex-1">
        {/* Album Cover */}
        <div className="relative w-12 h-12 rounded-md overflow-hidden mr-4 shrink-0">
          <img
            src={song.image_url || "https://via.placeholder.com/48"}
            alt={song.title}
            className="w-full h-full object-cover"
          />

          {/* Play Button Overlay */}
          {isHovered && hasPreview && (
            <button
              onClick={handlePlay}
              className="absolute inset-0 bg-black/60 flex items-center justify-center"
            >
              <i
                className={`fas ${
                  localIsPlaying ? "fa-pause" : "fa-play"
                } text-white text-lg`}
              ></i>
            </button>
          )}
        </div>

        {/* Song Info */}
        <div className="flex-1 min-w-0">
          <h3
            className={`font-medium truncate ${
              localIsPlaying ? "text-spotify-green" : "text-white"
            }`}
          >
            {song.title}
            {localIsPlaying && (
              <i className="fas fa-volume-up ml-2 text-xs"></i>
            )}
          </h3>
          <p className="text-spotify-gray text-sm truncate">{song.artist}</p>

          {/* Additional Info */}
          <div className="flex items-center mt-1 space-x-3">
            {hasPreview ? (
              <span className="text-xs text-spotify-green flex items-center">
                <i className="fas fa-music mr-1"></i>
                {formatDuration(song.duration_ms || 0)}
              </span>
            ) : (
              <span className="text-xs text-spotify-gray flex items-center">
                <i className="fas fa-external-link-alt mr-1"></i>
                Buka eksternal
              </span>
            )}

            {/* Audio Features Indicators */}
            {song.danceability && (
              <span className="text-xs text-spotify-gray hidden md:inline">
                <i className="fas fa-fire mr-1"></i>
                {Math.round(song.danceability * 100)}%
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center space-x-3">
        {/* Preview Indicator */}
        {!hasPreview && (
          <span
            className="text-xs text-spotify-gray px-2 py-1 bg-spotify-dark rounded"
            title="Tidak ada preview audio"
          >
            <i className="fas fa-info-circle mr-1"></i>
            No preview
          </span>
        )}

        {/* Play Button (for preview) */}
        {hasPreview && (
          <button
            onClick={handlePlay}
            className={`w-8 h-8 rounded-full flex items-center justify-center ${
              localIsPlaying
                ? "bg-spotify-green text-white"
                : "bg-spotify-light-dark text-spotify-gray hover:bg-spotify-light-gray hover:text-white"
            }`}
            title={localIsPlaying ? "Jeda" : "Putar preview (30 detik)"}
          >
            <i
              className={`fas ${
                localIsPlaying ? "fa-pause" : "fa-play"
              } text-xs`}
            ></i>
          </button>
        )}

        {/* Like Button */}
        {/* <button
          onClick={() => onToggleLike(song.id)}
          className={`w-8 h-8 rounded-full flex items-center justify-center ${
            song.isLiked
              ? "text-spotify-green hover:text-green-400"
              : "text-spotify-gray hover:text-white"
          }`}
          title={song.isLiked ? "Hapus dari favorit" : "Tambah ke favorit"}
        >
          <i className={`fas ${song.isLiked ? "fa-heart" : "fa-heart"}`}></i>
        </button> */}

        {/* More Options */}
        <button
          className="w-8 h-8 rounded-full flex items-center justify-center text-spotify-gray hover:text-white hover:bg-spotify-light-dark"
          title="Lainnya"
        >
          <i className="fas fa-ellipsis-h"></i>
        </button>
      </div>

      {/* Hidden Audio Element */}
      {hasPreview && (
        <audio
          ref={(el) => {
            if (el && !audioRef.current) {
              audioRef.current = el;
            }
          }}
          src={song.preview_url}
          preload="none"
          onEnded={() => setLocalIsPlaying(false)}
        />
      )}
    </div>
  );
};

export default SongCard;
