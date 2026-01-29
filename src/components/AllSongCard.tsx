import React, { useState, useEffect } from "react";
import {
  Play,
  Heart,
  Pause,
  Loader2,
  Clock,
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
  index?: number;
  showIndex?: boolean;
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
  const [showPlayHover, setShowPlayHover] = useState(false);

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
    }
  };

  const handlePlayNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onPlayNext) {
      onPlayNext(song);
    }
  };

  const formatDuration = (tempo?: number) => {
    if (!tempo) return "0:00";
    const durationMs = (tempo / 60) * 1000; // Convert BPM to approximate duration
    const minutes = Math.floor(durationMs / 60000);
    const seconds = Math.floor((durationMs % 60000) / 1000);
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };

  return (
    <div
      onClick={handlePlay}
      onMouseEnter={() => setShowPlayHover(true)}
      onMouseLeave={() => setShowPlayHover(false)}
      className={`
        group flex items-center gap-4 p-4 rounded-xl cursor-pointer
        transition-all duration-300 relative
        ${
          isPlaying
            ? "bg-linear-to-r from-purple-500/10 to-pink-500/10 border-l-4 border-purple-500 shadow-lg shadow-purple-900/20"
            : "hover:bg-gray-800/40 bg-gray-900/30 backdrop-blur-sm"
        }
        ${compact ? "py-3" : ""}
        ${isAnimating && localLikeState ? "ring-1 ring-pink-500/30" : ""}
        border border-gray-800/30 hover:border-gray-700/50
      `}
    >
      {/* Background Glow Effect */}
      <div className="absolute inset-0 rounded-xl bg-linear-to-r from-purple-900/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

      {/* Album Art */}
      <div className="relative shrink-0">
        <div
          className={`
            w-14 h-14 rounded-lg overflow-hidden transition-all duration-500
            ${isPlaying ? "ring-2 ring-purple-500 scale-105 shadow-lg shadow-purple-900/30" : ""}
            ${isAnimating && localLikeState ? "ring-2 ring-pink-500/30" : ""}
            group-hover:shadow-xl group-hover:shadow-purple-900/20
          `}
        >
          {/* Image with linear overlay */}
          <div className="relative w-full h-full">
            <img
              src={song.image_url || "/placeholder-album.jpg"}
              alt={song.title}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-linear-to-t from-black/40 via-transparent to-transparent"></div>
          </div>

          {/* Play Button Overlay */}
          <button
            onClick={handlePlay}
            disabled={playLoading}
            className={`
              absolute inset-0 flex items-center justify-center
              backdrop-blur-sm transition-all duration-300
              ${isPlaying || playLoading ? "bg-black/70 opacity-100" : "bg-black/50 opacity-0 group-hover:opacity-100"}
              ${playLoading ? "cursor-not-allowed" : "cursor-pointer"}
              rounded-lg
            `}
          >
            {playLoading ? (
              <div className="relative w-8 h-8">
                <Loader2 className="w-8 h-8 animate-spin text-white" />
              </div>
            ) : isPlaying ? (
              <div className="relative overflow-hidden group/play-btn w-10 h-10 rounded-full">
                <div className="absolute inset-0 bg-linear-to-r from-purple-600 to-pink-500"></div>
                <Pause className="relative z-10 w-5 h-5 text-white mx-auto" />
              </div>
            ) : (
              <div className="relative overflow-hidden group/play-btn w-10 h-10 rounded-full">
                <div className="absolute inset-0 bg-linear-to-r from-purple-600 to-pink-500"></div>
                <div className="absolute inset-0 bg-linear-to-r from-purple-500 to-pink-400 opacity-0 group-hover/play-btn:opacity-100 transition-opacity"></div>
                <Play className="relative z-10 w-5 h-5 text-white ml-0.5 mx-auto" />
              </div>
            )}
          </button>

          {/* Playing Indicator */}
          {isPlaying && !playLoading && (
            <div className="absolute -bottom-1 -right-1">
              <div className="flex gap-0.5 bg-black/80 backdrop-blur-sm rounded-full px-2 py-1 border border-purple-500/30">
                <div className="w-1.5 h-3 bg-purple-400 rounded-full animate-pulse-fast"></div>
                <div
                  className="w-1.5 h-4 bg-purple-400 rounded-full animate-pulse-fast"
                  style={{ animationDelay: "150ms" }}
                ></div>
                <div
                  className="w-1.5 h-3 bg-purple-400 rounded-full animate-pulse-fast"
                  style={{ animationDelay: "300ms" }}
                ></div>
              </div>
            </div>
          )}
        </div>

        {/* Queue Actions (hover only) */}
        {showQueueActions && (showPlayHover || isPlaying) && (
          <div className="absolute -right-2 top-1/2 -translate-y-1/2 flex flex-col gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <button
              onClick={handleAddToQueue}
              className="w-7 h-7 bg-gray-800/90 hover:bg-gray-700/90 backdrop-blur-sm rounded-full flex items-center justify-center border border-gray-700/50 transition-all duration-200 hover:scale-110 active:scale-95"
              title="Add to queue"
            >
              <Plus className="w-3 h-3 text-gray-300" />
            </button>
            <button
              onClick={handlePlayNext}
              className="w-7 h-7 bg-gray-800/90 hover:bg-gray-700/90 backdrop-blur-sm rounded-full flex items-center justify-center border border-gray-700/50 transition-all duration-200 hover:scale-110 active:scale-95"
              title="Play next"
            >
              <SkipForward className="w-3 h-3 text-gray-300" />
            </button>
          </div>
        )}
      </div>

      {/* Song Info */}
      <div className="flex-1 min-w-0">
        <h3
          className={`
            truncate font-semibold transition-colors duration-200
            ${isPlaying ? "text-purple-300" : "text-white group-hover:text-purple-200"}
          `}
        >
          {song.title}
        </h3>
        <p className="truncate text-sm text-gray-400 group-hover:text-gray-300">
          {song.artist}
        </p>

        {/* Album and Genre Info */}
        {!compact && (song.album || song.genre) && (
          <div className="flex items-center gap-2 mt-1">
            {song.album && (
              <span className="text-xs text-gray-500 bg-gray-800/50 px-2 py-0.5 rounded-full">
                {song.album}
              </span>
            )}
            {song.genre && (
              <span className="text-xs text-purple-400 bg-purple-900/20 px-2 py-0.5 rounded-full">
                {song.genre}
              </span>
            )}
          </div>
        )}
      </div>

      {/* Duration */}
      {!compact && (
        <div className="flex items-center gap-2 text-sm text-gray-400 group-hover:text-gray-300 transition-colors duration-200">
          <Clock className="w-3.5 h-3.5" />
          <span>
            {formatDuration(
              song.duration_ms ? song.duration_ms / 1000 : song.tempo,
            )}
          </span>
        </div>
      )}

      {/* Like Button */}
      <div className="relative shrink-0">
        <button
          onClick={handleLike}
          disabled={likeLoading || isAnimating}
          className={`
            relative overflow-hidden group/like w-9 h-9
            rounded-full flex items-center justify-center
            transition-all duration-300 ease-out
            ${likeLoading || isAnimating ? "opacity-70 cursor-not-allowed" : ""}
            active:scale-95
          `}
        >
          {/* Background */}
          <div
            className={`absolute inset-0 rounded-full transition-all duration-300 ${
              localLikeState
                ? "bg-linear-to-r from-pink-600/20 to-pink-500/20"
                : "bg-gray-800/50 backdrop-blur-sm"
            }`}
          ></div>

          {/* Hover linear */}
          <div className="absolute inset-0 bg-linear-to-r from-pink-600/30 to-pink-500/30 opacity-0 group-hover/like:opacity-100 transition-opacity duration-300 rounded-full"></div>

          {/* Icon */}
          <div className="relative z-10">
            {likeLoading ? (
              <Loader2 className="w-4 h-4 text-pink-400 animate-spin" />
            ) : (
              <Heart
                className={`
                  w-4 h-4 transition-all duration-300
                  ${localLikeState ? "fill-pink-400 text-pink-400" : "text-gray-400 group-hover/like:text-pink-300"}
                  ${isAnimating && localLikeState ? "scale-125" : ""}
                `}
              />
            )}
          </div>

          {/* Pulsing effect when liked and animating */}
          {isAnimating && localLikeState && (
            <div className="absolute -inset-3">
              <div className="absolute inset-0 rounded-full bg-pink-500/20 animate-ping-fast"></div>
            </div>
          )}
        </button>

        {/* Floating particles effect */}
        {isAnimating && localLikeState && (
          <>
            <div
              className="absolute -top-1 -right-1 w-2 h-2 bg-pink-400 rounded-full animate-float"
              style={{ animationDelay: "0s" }}
            />
            <div
              className="absolute -top-2 right-2 w-1.5 h-1.5 bg-pink-300 rounded-full animate-float"
              style={{ animationDelay: "0.1s" }}
            />
            <div
              className="absolute top-0 -right-2 w-1 h-1 bg-pink-200 rounded-full animate-float"
              style={{ animationDelay: "0.2s" }}
            />
          </>
        )}

        {/* Static glow for liked songs */}
        {song.is_liked && !likeLoading && !isAnimating && (
          <div className="absolute -inset-2 pointer-events-none">
            <div className="absolute inset-0 rounded-full bg-linear-to-br from-pink-500/10 via-transparent to-transparent animate-pulse-slow"></div>
          </div>
        )}
      </div>
    </div>
  );
};

// CSS animations
const styles = `
  @keyframes pulse-fast {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.5; }
  }
  
  @keyframes ping-fast {
    75%, 100% { transform: scale(2); opacity: 0; }
  }
  
  @keyframes float {
    0%, 100% { transform: translateY(0) scale(1); opacity: 1; }
    50% { transform: translateY(-8px) scale(1.1); opacity: 0.8; }
  }
  
  @keyframes pulse-slow {
    0%, 100% { opacity: 0.1; }
    50% { opacity: 0.3; }
  }
  
  .animate-pulse-fast {
    animation: pulse-fast 0.8s ease-in-out infinite;
  }
  
  .animate-ping-fast {
    animation: ping-fast 0.6s cubic-bezier(0, 0, 0.2, 1) infinite;
  }
  
  .animate-float {
    animation: float 0.8s ease-in-out;
  }
  
  .animate-pulse-slow {
    animation: pulse-slow 3s ease-in-out infinite;
  }
`;

// Add styles to document head
if (typeof document !== "undefined") {
  const styleSheet = document.createElement("style");
  styleSheet.textContent = styles;
  document.head.appendChild(styleSheet);
}

export default AllSongsCard;
