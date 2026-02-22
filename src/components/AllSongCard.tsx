import React, { useState, useEffect } from "react";
import {
  Play,
  Heart,
  Pause,
  Loader2,
  MoreHorizontal,
  Plus,
  SkipForward,
} from "lucide-react";
import type { Song } from "../apis/models/models";

interface AllSongsCardProps {
  song: Song;
  onPlay: (song: Song) => Promise<void> | void;
  onLike: (song: Song) => Promise<void> | void;
  isPlaying?: boolean;
  likeLoading?: boolean;
  playLoading?: boolean;
  compact?: boolean;
  showQueueActions?: boolean;
  onAddToQueue?: (song: Song) => void;
  onPlayNext?: (song: Song) => void;
}

const AllSongsCard: React.FC<AllSongsCardProps> = ({
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
  const [showActions, setShowActions] = useState(false);

  useEffect(() => {
    setLocalLikeState(song.is_liked);
  }, [song.is_liked]);

  const handleLike = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (likeLoading || isAnimating) return;

    setIsAnimating(true);
    setLocalLikeState(!localLikeState);

    try {
      await onLike(song);
    } catch (error) {
      setLocalLikeState(song.is_liked);
    } finally {
      setTimeout(() => setIsAnimating(false), 400);
    }
  };

  const handlePlay = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (playLoading) return;
    await onPlay(song);
  };

  const handleAddToQueue = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onAddToQueue) {
      onAddToQueue(song);
      setShowActions(false);
    }
  };

  const handlePlayNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onPlayNext) {
      onPlayNext(song);
      setShowActions(false);
    }
  };

  const formatDuration = (ms: number) => {
    if (!ms) return "0:00";
    const minutes = Math.floor(ms / 60000);
    const seconds = Math.floor((ms % 60000) / 1000);
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };

  return (
    <div
      onClick={handlePlay}
      className={`
        relative flex items-center gap-3 px-4 py-3
        transition-all duration-200 active:bg-gray-800/50
        ${
          isPlaying
            ? "bg-linear-to-r from-purple-900/20 to-pink-900/20 border-l-4 border-purple-500"
            : "hover:bg-gray-800/30"
        }
      `}
    >
      {/* Album Art with Play Button Overlay */}
      <div className="relative shrink-0">
        <div
          className={`
          w-14 h-14 rounded-lg overflow-hidden
          ${isPlaying ? "ring-2 ring-purple-500 shadow-lg shadow-purple-500/20" : ""}
        `}
        >
          <img
            src={song.image_url || "/placeholder-album.jpg"}
            alt={song.title}
            className="w-full h-full object-cover"
          />

          {/* Subtle linear overlay */}
          <div className="absolute inset-0 bg-linear-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
        </div>

        {/* Minimal Play Button Overlay */}
        <button
          onClick={handlePlay}
          disabled={playLoading}
          className={`
            absolute inset-0 flex items-center justify-center
            transition-all duration-200 rounded-lg
            ${playLoading ? "bg-black/40" : "hover:bg-black/20"}
            ${isPlaying ? "bg-black/30" : ""}
          `}
        >
          {playLoading ? (
            <Loader2 className="w-6 h-6 text-white animate-spin drop-shadow-lg" />
          ) : isPlaying ? (
            <div className="relative">
              {/* Minimal playing indicator */}
              <div className="absolute -inset-2 bg-purple-500/20 rounded-full blur-sm"></div>
              <Pause className="relative w-6 h-6 text-white drop-shadow-lg" />
            </div>
          ) : (
            <Play className="w-6 h-6 text-white opacity-0 group-hover:opacity-100 transition-opacity drop-shadow-lg" />
          )}
        </button>

        {/* Tiny playing indicator dot (optional) */}
        {isPlaying && !playLoading && (
          <div className="absolute -top-1 -right-1 w-2.5 h-2.5">
            <div className="absolute inset-0 bg-purple-500 rounded-full animate-ping"></div>
            <div className="absolute inset-0 bg-purple-500 rounded-full"></div>
          </div>
        )}
      </div>

      {/* Song Info */}
      <div className="flex-1 min-w-0">
        <h3
          className={`
          font-medium truncate text-base
          ${isPlaying ? "text-purple-400" : "text-white"}
        `}
        >
          {song.title}
        </h3>

        <p className="text-sm text-gray-400 truncate">
          {song.artist}
          {song.album && !compact && (
            <span className="text-gray-500"> • {song.album}</span>
          )}
        </p>

        {/* Mobile metadata */}
        {!compact && (
          <div className="flex items-center gap-2 mt-1">
            {song.genre && (
              <span className="text-xs text-purple-400 bg-purple-900/30 px-2 py-0.5 rounded-full">
                {song.genre}
              </span>
            )}
            <span className="text-xs text-gray-500">
              {formatDuration(song.duration_ms)}
            </span>
          </div>
        )}
      </div>

      {/* Duration for compact mode */}
      {compact && (
        <span className="text-xs text-gray-500 shrink-0">
          {formatDuration(song.duration_ms)}
        </span>
      )}

      {/* Action Buttons */}
      <div className="flex items-center gap-1 shrink-0">
        {/* Like Button */}
        <button
          onClick={handleLike}
          disabled={likeLoading || isAnimating}
          className={`
            relative p-2.5 rounded-full transition-all duration-200
            active:scale-90 active:bg-gray-800/50
            ${localLikeState ? "text-pink-400" : "text-gray-400 hover:text-pink-400"}
          `}
        >
          {likeLoading ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : (
            <Heart
              className={`
                w-5 h-5 transition-all duration-200
                ${localLikeState ? "fill-pink-400" : ""}
                ${isAnimating && localLikeState ? "scale-125" : ""}
              `}
            />
          )}
        </button>

        {/* More Actions */}
        {showQueueActions && (
          <div className="relative">
            <button
              onClick={(e) => {
                e.stopPropagation();
                setShowActions(!showActions);
              }}
              className="p-2.5 rounded-full text-gray-400 hover:text-purple-400 active:bg-gray-800/50 transition-all"
            >
              <MoreHorizontal className="w-5 h-5" />
            </button>

            {/* Actions Popup */}
            {showActions && (
              <>
                <div
                  className="fixed inset-0 z-40"
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowActions(false);
                  }}
                />

                <div className="absolute right-0 bottom-full mb-2 z-50 min-w-44">
                  <div className="bg-gray-900 rounded-xl border border-gray-800 shadow-xl overflow-hidden backdrop-blur-sm">
                    <button
                      onClick={handleAddToQueue}
                      className="w-full px-4 py-3.5 flex items-center gap-3 text-left hover:bg-gray-800 transition-colors active:bg-gray-700"
                    >
                      <Plus className="w-4 h-4 text-purple-400" />
                      <span className="text-sm text-white">Add to Queue</span>
                    </button>
                    <button
                      onClick={handlePlayNext}
                      className="w-full px-4 py-3.5 flex items-center gap-3 text-left hover:bg-gray-800 transition-colors border-t border-gray-800 active:bg-gray-700"
                    >
                      <SkipForward className="w-4 h-4 text-pink-400" />
                      <span className="text-sm text-white">Play Next</span>
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        )}
      </div>

      {/* Like Animation */}
      {isAnimating && localLikeState && (
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
            {[...Array(3)].map((_, i) => (
              <div
                key={i}
                className="absolute w-1 h-1 bg-pink-400 rounded-full"
                style={{
                  animation: `float-particle 0.6s ease-out forwards`,
                  animationDelay: `${i * 0.1}s`,
                  transform: `rotate(${i * 120}deg) translateY(-12px)`,
                }}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

// Styles
if (typeof document !== "undefined") {
  const style = document.createElement("style");
  style.textContent = `
    @keyframes float-particle {
      0% {
        opacity: 1;
        transform: translate(0, 0) scale(1);
      }
      100% {
        opacity: 0;
        transform: translate(var(--x, 20px), var(--y, -20px)) scale(0);
      }
    }
  `;
  document.head.appendChild(style);
}

export default AllSongsCard;
