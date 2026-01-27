// components/AllSongsCard.tsx (VERSI SMOOTH SIMPLE)
import React, { useState, useEffect } from "react";
import { Play, Heart, Pause, Loader2, MoreVertical, Clock } from "lucide-react";
import type { Song } from "../apis/models/models";

interface AllSongsCardProps {
  song: Song;
  onPlay: (song: Song) => Promise<void> | void;
  onLike: (song: Song) => Promise<void> | void;
  isPlaying?: boolean;
  likeLoading?: boolean;
  playLoading?: boolean;
  index?: number;
  showIndex?: boolean;
  compact?: boolean;
  showQueueActions?: boolean;
  onAddToQueue?: (song: Song) => void; // Tambah
  onPlayNext?: (song: Song) => void; // Tambah
}

const AllSongsCard: React.FC<AllSongsCardProps> = ({
  song,
  onPlay,
  onLike,
  isPlaying = false,
  likeLoading = false,
  playLoading = false,
  index = 1,
  showIndex = true,
  compact = false,
}) => {
  const [showMoreMenu, setShowMoreMenu] = useState(false);
  const [localLikeState, setLocalLikeState] = useState(song.is_liked);
  const [isAnimating, setIsAnimating] = useState(false);

  // Update local state when prop changes
  useEffect(() => {
    setLocalLikeState(song.is_liked);
  }, [song.is_liked]);

  const handleLike = async (e: React.MouseEvent) => {
    e.stopPropagation();

    // Prevent double click
    if (likeLoading || isAnimating) return;

    // Start animation
    setIsAnimating(true);

    // Optimistic update
    setLocalLikeState(!localLikeState);

    try {
      await onLike(song);
    } catch (error) {
      // Rollback on error
      setLocalLikeState(song.is_liked);
    } finally {
      // Stop animation after a delay
      setTimeout(() => setIsAnimating(false), 400);
    }
  };

  const handlePlay = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (playLoading) return;
    await onPlay(song);
  };

  const handleCardClick = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (playLoading) return;
    await onPlay(song);
  };

  const formatDuration = (seconds?: number) => {
    if (!seconds) return "0:00";
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <div
      onClick={handleCardClick}
      className={`
        group flex items-center gap-4 p-3 rounded-lg cursor-pointer
        transition-all duration-200
        ${
          isPlaying
            ? "bg-green-500/10 border-l-4 border-green-500"
            : "hover:bg-zinc-800/30"
        }
        ${compact ? "py-2" : ""}
      `}
    >
      {/* Index */}
      {/* {showIndex && (
        <div className="w-6 text-sm text-zinc-400 group-hover:text-white transition-colors duration-200">
          {index}
        </div>
      )} */}

      {/* Album */}
      <div className="relative">
        <div
          className={`
            w-12 h-12 rounded-md overflow-hidden transition-all duration-300
            ${isPlaying ? "ring-2 ring-green-500 scale-105" : ""}
            ${isAnimating && localLikeState ? "ring-2 ring-red-500/30" : ""}
          `}
        >
          <img
            src={song.image_url || "/placeholder-album.jpg"}
            alt={song.title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
        </div>

        <button
          onClick={handlePlay}
          disabled={playLoading}
          className={`
            absolute inset-0 flex items-center justify-center
            bg-black/60 rounded-md transition-all duration-200
            ${isPlaying ? "opacity-100" : "opacity-0 group-hover:opacity-100"}
            ${playLoading ? "cursor-not-allowed" : "cursor-pointer"}
            hover:bg-black/70
          `}
        >
          {playLoading ? (
            <Loader2 className="w-5 h-5 animate-spin text-white" />
          ) : isPlaying ? (
            <Pause className="w-5 h-5 text-white" />
          ) : (
            <Play className="w-5 h-5 text-white" />
          )}
        </button>
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <h3
          className={`
            truncate font-medium transition-colors duration-200
            ${isPlaying ? "text-green-500" : "text-white"}
          `}
        >
          {song.title}
        </h3>
        <p className="truncate text-sm text-zinc-400">{song.artist}</p>
      </div>

      {/* Duration */}
      {!compact && (
        <div className="flex items-center gap-1 text-sm text-zinc-400">
          <Clock className="w-3 h-3" />
          {formatDuration(song.tempo)}
        </div>
      )}

      {/* ❤️ LIKE BUTTON dengan Animasi */}
      <div className="relative">
        <button
          onClick={handleLike}
          disabled={likeLoading || isAnimating}
          className={`
            relative w-8 h-8 flex items-center justify-center rounded-full
            transition-all duration-300 ease-out
            ${likeLoading || isAnimating ? "opacity-70 cursor-not-allowed" : ""}
            ${
              localLikeState
                ? "bg-red-500/20 text-red-400 hover:bg-red-500/30"
                : "bg-zinc-800/30 text-zinc-400 hover:bg-zinc-700/50 hover:text-white"
            }
            ${isAnimating ? "scale-110" : "hover:scale-110"}
            active:scale-95
          `}
        >
          {likeLoading ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <>
              <Heart
                className={`
                  w-4 h-4 transition-all duration-300
                  ${localLikeState ? "fill-current" : ""}
                  ${isAnimating && localLikeState ? "scale-125" : ""}
                `}
              />

              {/* Pulsing effect when liked and animating */}
              {isAnimating && localLikeState && (
                <div className="absolute -inset-2">
                  <div className="absolute inset-0 rounded-full bg-red-500/20 animate-ping" />
                </div>
              )}
            </>
          )}
        </button>

        {isAnimating && localLikeState && (
          <>
            <div
              className="absolute -top-1 -right-1 w-2 h-2 bg-red-400 rounded-full animate-float"
              style={{ animationDelay: "0s" }}
            />
            <div
              className="absolute -top-2 right-2 w-1.5 h-1.5 bg-red-300 rounded-full animate-float"
              style={{ animationDelay: "0.1s" }}
            />
            <div
              className="absolute top-0 -right-2 w-1 h-1 bg-red-200 rounded-full animate-float"
              style={{ animationDelay: "0.2s" }}
            />
          </>
        )}
      </div>
    </div>
  );
};

export default AllSongsCard;
