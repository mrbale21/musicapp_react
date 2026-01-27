// components/PopularCard.tsx
import React, { useState, useEffect } from "react";
import { Play, Heart, Pause, Loader2, Plus, SkipForward } from "lucide-react";
import type { Song } from "../apis/models/models";
import { useNavigate } from "react-router-dom";

interface PopularCardProps {
  song: Song;
  onPlay: (song: Song) => Promise<void> | void;
  onLike: (song: Song) => Promise<void> | void;
  isPlaying?: boolean;
  likeLoading?: boolean;
  playLoading?: boolean;
  compact?: boolean;
  showQueueActions?: boolean;
  onAddToQueue?: (song: Song) => void; // Tambah
  onPlayNext?: (song: Song) => void; // Tambah
}

const PopularCard: React.FC<PopularCardProps> = ({
  song,
  onPlay,
  onLike,
  isPlaying = false,
  likeLoading = false,
  playLoading = false,
  compact = false,
  showQueueActions = false,
  onAddToQueue,
  onPlayNext,
}) => {
  const [localLikeState, setLocalLikeState] = useState(song.is_liked);
  const [isAnimating, setIsAnimating] = useState(false);
  const navigate = useNavigate();

  // Update local state when prop changes
  useEffect(() => {
    setLocalLikeState(song.is_liked);
  }, [song.is_liked]);

  const handlePlay = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (playLoading) return;
    await onPlay(song);
  };
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

  const handleCardClick = (e: React.MouseEvent) => {
    // HANYA untuk navigasi, TIDAK play musik
    // Parent akan menangani navigasi
    // Tidak perlu memanggil onPlay di sini
    navigate(`/song/${song.id}`);
    e.stopPropagation();
  };

  const handleAddToQueue = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onAddToQueue) {
      onAddToQueue(song);
    }
  };

  const handlePlayNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onPlayNext) {
      onPlayNext(song);
    }
  };

  return (
    <div
      onClick={handleCardClick}
      className={`
        group relative bg-zinc-900/50 rounded-xl p-3 
        transition-all duration-200 cursor-pointer
        ${isPlaying ? "ring-2 ring-green-500" : "hover:bg-zinc-800/30"}
        ${compact ? "p-2" : ""}
        ${isAnimating && localLikeState ? "ring-2 ring-red-500/30" : ""}
      `}
    >
      <div className="relative">
        {/* Album Art */}
        <div
          className={`
            aspect-square rounded-lg overflow-hidden mb-3 relative
            ${compact ? "mb-2" : ""}
            ${isAnimating && localLikeState ? "ring-2 ring-red-500/30" : ""}
          `}
        >
          <img
            src={song.image_url || "/placeholder-album.jpg"}
            alt={song.title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          />

          {/* Play Button Overlay */}
          <div
            className={`
              absolute inset-0 flex items-center justify-center
              transition-all duration-200
              ${
                isPlaying || playLoading
                  ? "bg-black/60 opacity-100"
                  : "bg-black/40 opacity-0 group-hover:opacity-100"
              }
            `}
          >
            <button
              onClick={handlePlay}
              disabled={playLoading}
              className={`
                w-12 h-12 bg-green-500 rounded-full flex items-center justify-center
                transform transition-all duration-200 shadow-lg
                ${
                  playLoading
                    ? "scale-95 cursor-not-allowed"
                    : "hover:scale-110 active:scale-95"
                }
                ${compact ? "w-10 h-10" : ""}
              `}
            >
              {playLoading ? (
                <Loader2 className="w-5 h-5 text-white animate-spin" />
              ) : isPlaying ? (
                <Pause className="w-5 h-5 text-white" />
              ) : (
                <Play className="w-5 h-5 text-white ml-0.5" />
              )}
            </button>
          </div>

          {/* Playing Indicator */}
          {isPlaying && !playLoading && (
            <div className="absolute bottom-2 left-2 flex items-center gap-1 bg-black/60 rounded-full px-2 py-1">
              <div className="flex gap-0.5">
                <div
                  className="w-1 h-2 bg-green-500 animate-pulse"
                  style={{ animationDelay: "0ms" }}
                ></div>
                <div
                  className="w-1 h-2 bg-green-500 animate-pulse"
                  style={{ animationDelay: "150ms" }}
                ></div>
                <div
                  className="w-1 h-2 bg-green-500 animate-pulse"
                  style={{ animationDelay: "300ms" }}
                ></div>
              </div>
              <span className="text-xs text-green-400 font-medium ml-1">
                Playing
              </span>
            </div>
          )}

          {/* Like Pulse Animation */}
          {isAnimating && localLikeState && (
            <div className="absolute inset-0">
              <div className="absolute inset-0 bg-gradient-to-br from-red-500/5 to-transparent rounded-lg animate-pulse-fast" />
            </div>
          )}
        </div>

        {/* Song Info */}
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1 min-w-0">
            <h3
              className={`
                font-semibold text-white truncate transition-colors duration-200
                ${compact ? "text-sm" : ""}
                ${isPlaying ? "text-green-500" : ""}
              `}
            >
              {song.title}
            </h3>
            <p
              className={`
                text-zinc-400 truncate transition-colors duration-200
                ${compact ? "text-xs" : "text-sm"}
                ${isPlaying ? "text-green-400" : ""}
              `}
            >
              {song.artist}
            </p>

            {/* Popularity indicator */}
            {!compact && (
              <div className="flex items-center gap-1 mt-1">
                <div className="flex items-center gap-0.5">
                  {[...Array(5)].map((_, i) => (
                    <div
                      key={i}
                      className={`w-1 h-1 rounded-full transition-all duration-300 ${
                        i < Math.floor((song.popularity ?? 0) / 20)
                          ? "bg-green-500"
                          : "bg-zinc-700"
                      }`}
                    />
                  ))}
                </div>
                <span className="text-xs text-zinc-500 ml-1">
                  {song.popularity ?? 0}%
                </span>
              </div>
            )}
          </div>
          {showQueueActions && (
            <div className="absolute top-2 left-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
              <button
                onClick={handleAddToQueue}
                className="w-6 h-6 bg-blue-800/80 hover:bg-zinc-700 rounded-full flex items-center justify-center"
                title="Add to queue"
              >
                <Plus className="w-3 h-3 text-white" />
              </button>
              <button
                onClick={handlePlayNext}
                className="w-6 h-6 bg-zinc-800/80 hover:bg-zinc-700 rounded-full flex items-center justify-center"
                title="Play next"
              >
                <SkipForward className="w-3 h-3 text-white" />
              </button>
            </div>
          )}

          {/* Like Button dengan Animasi */}
          <div className="relative">
            <button
              onClick={handleLike}
              disabled={likeLoading || isAnimating}
              className={`
                flex-shrink-0
                w-8 h-8 rounded-full flex items-center justify-center
                transition-all duration-300 ease-out
                ${
                  likeLoading || isAnimating
                    ? "opacity-70 cursor-not-allowed"
                    : ""
                }
                ${
                  localLikeState
                    ? "bg-red-500/20 text-red-400 hover:bg-red-500/30"
                    : "bg-zinc-800/30 text-zinc-400 hover:bg-zinc-700/50 hover:text-white"
                }
                ${isAnimating ? "scale-110" : "hover:scale-110"}
                active:scale-95
                ${compact ? "w-7 h-7" : ""}
              `}
            >
              {likeLoading ? (
                <Loader2
                  className={`${compact ? "w-3 h-3" : "w-4 h-4"} animate-spin`}
                />
              ) : (
                <>
                  <Heart
                    className={`
                      ${compact ? "w-3 h-3" : "w-4 h-4"} 
                      transition-all duration-300
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

            {/* Floating particles effect */}
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
      </div>

      {/* Pulse animation when liked (static) */}
      {song.is_liked && !likeLoading && !isAnimating && (
        <div className="absolute -top-1 -right-1 w-10 h-10 pointer-events-none">
          <div className="absolute inset-0 rounded-full bg-red-500/10 animate-pulse-slow"></div>
          <div className="absolute inset-2 rounded-full bg-red-500/5"></div>
        </div>
      )}
    </div>
  );
};

export default PopularCard;
