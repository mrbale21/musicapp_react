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
  onAddToQueue?: (song: Song) => void;
  onPlayNext?: (song: Song) => void;
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

  const handleCardClick = (e: React.MouseEvent) => {
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
        group relative bg-gray-900/30 backdrop-blur-sm rounded-2xl p-4 
        transition-all duration-300 cursor-pointer
        ${isPlaying ? "ring-2 ring-purple-500 shadow-lg shadow-purple-900/30" : "hover:bg-gray-800/40"}
        ${compact ? "p-3" : ""}
        ${isAnimating && localLikeState ? "ring-2 ring-pink-500/30" : ""}
        border border-gray-800/50
      `}
    >
      {/* Background Glow Effect */}
      <div className="absolute inset-0 rounded-2xl bg-linear-to-br from-purple-900/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

      <div className="relative">
        {/* Album Art */}
        <div
          className={`
            relative aspect-square rounded-xl overflow-hidden mb-4
            ${compact ? "mb-3" : ""}
            group-hover:shadow-xl group-hover:shadow-purple-900/20 transition-shadow duration-300
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
          <div
            className={`
              absolute inset-0 flex items-center justify-center
              transition-all duration-300
              ${
                isPlaying || playLoading
                  ? "bg-black/70 backdrop-blur-sm opacity-100"
                  : "bg-black/50 backdrop-blur-sm opacity-0 group-hover:opacity-100"
              }
            `}
          >
            <button
              onClick={handlePlay}
              disabled={playLoading}
              className={`
                relative overflow-hidden group/play
                ${compact ? "w-12 h-12" : "w-14 h-14"}
                rounded-full flex items-center justify-center
                transform transition-all duration-300
                ${playLoading ? "scale-95 cursor-not-allowed" : "hover:scale-110 active:scale-95"}
              `}
            >
              {/* Button Background linear */}
              <div className="absolute inset-0 bg-linear-to-r from-purple-600 to-pink-500"></div>
              <div className="absolute inset-0 bg-linear-to-r from-purple-500 to-pink-400 opacity-0 group-hover/play:opacity-100 transition-opacity"></div>

              {/* Icon */}
              <div className="relative z-10">
                {playLoading ? (
                  <Loader2
                    className={`${compact ? "w-5 h-5" : "w-6 h-6"} text-white animate-spin`}
                  />
                ) : isPlaying ? (
                  <Pause
                    className={`${compact ? "w-5 h-5" : "w-6 h-6"} text-white`}
                  />
                ) : (
                  <Play
                    className={`${compact ? "w-5 h-5" : "w-6 h-6"} text-white ml-0.5`}
                  />
                )}
              </div>
            </button>
          </div>

          {/* Playing Indicator */}
          {isPlaying && !playLoading && (
            <div className="absolute bottom-3 left-3 flex items-center gap-2 bg-black/70 backdrop-blur-md rounded-full px-3 py-1.5 border border-purple-500/30">
              <div className="flex gap-1">
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
              <span className="text-xs font-medium text-purple-300 ml-1">
                Now Playing
              </span>
            </div>
          )}

          {/* Like Pulse Animation */}
          {isAnimating && localLikeState && (
            <div className="absolute inset-0 bg-linear-to-br from-pink-500/10 to-transparent rounded-xl animate-ping-fast"></div>
          )}
        </div>

        {/* Song Info */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            <h3
              className={`
                font-bold text-white truncate transition-colors duration-200
                ${compact ? "text-sm" : "text-base"}
                ${isPlaying ? "text-purple-300" : "group-hover:text-purple-200"}
              `}
            >
              {song.title}
            </h3>
            <p
              className={`
                truncate transition-colors duration-200
                ${compact ? "text-xs" : "text-sm"}
                ${isPlaying ? "text-purple-400" : "text-gray-400 group-hover:text-gray-300"}
              `}
            >
              {song.artist}
            </p>

            {/* Stats */}
            {!compact && (
              <div className="flex items-center gap-3 mt-2">
                {/* Popularity */}
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1">
                    {[...Array(5)].map((_, i) => (
                      <div
                        key={i}
                        className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${
                          i < Math.floor((song.popularity ?? 0) / 20)
                            ? "bg-linear-to-r from-purple-400 to-pink-400"
                            : "bg-gray-700"
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-xs text-gray-500 font-medium">
                    {song.popularity ?? 0}%
                  </span>
                </div>

                {/* Duration */}
                {song.duration_ms && (
                  <div className="flex items-center gap-1">
                    <div className="w-1 h-1 bg-gray-600 rounded-full"></div>
                    <span className="text-xs text-gray-500">
                      {Math.floor(song.duration_ms / 60000)}:
                      {((song.duration_ms % 60000) / 1000)
                        .toFixed(0)
                        .padStart(2, "0")}
                    </span>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Queue Actions */}
          {showQueueActions && (
            <div className="absolute top-3 right-3 flex flex-col gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <button
                onClick={handleAddToQueue}
                className="w-8 h-8 bg-gray-800/80 hover:bg-gray-700/80 backdrop-blur-sm rounded-full flex items-center justify-center border border-gray-700/50 transition-all duration-200 hover:scale-110 active:scale-95"
                title="Add to queue"
              >
                <Plus className="w-3.5 h-3.5 text-gray-300" />
              </button>
              <button
                onClick={handlePlayNext}
                className="w-8 h-8 bg-gray-800/80 hover:bg-gray-700/80 backdrop-blur-sm rounded-full flex items-center justify-center border border-gray-700/50 transition-all duration-200 hover:scale-110 active:scale-95"
                title="Play next"
              >
                <SkipForward className="w-3.5 h-3.5 text-gray-300" />
              </button>
            </div>
          )}

          {/* Like Button */}
          <div className="relative">
            <button
              onClick={handleLike}
              disabled={likeLoading || isAnimating}
              className={`
                shrink-0 relative overflow-hidden group/like
                ${compact ? "w-9 h-9" : "w-10 h-10"}
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
                  <Loader2
                    className={`${compact ? "w-4 h-4" : "w-5 h-5"} text-pink-400 animate-spin`}
                  />
                ) : (
                  <Heart
                    className={`
                      ${compact ? "w-4 h-4" : "w-5 h-5"} 
                      transition-all duration-300
                      ${localLikeState ? "fill-pink-400 text-pink-400" : "text-gray-400 group-hover/like:text-pink-300"}
                      ${isAnimating && localLikeState ? "scale-125" : ""}
                    `}
                  />
                )}
              </div>

              {/* Pulsing effect when liked and animating */}
              {isAnimating && localLikeState && (
                <div className="absolute -inset-3">
                  <div className="absolute inset-0 rounded-full bg-pink-500/20 animate-ping"></div>
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
                  className="absolute -top-2 right-3 w-1.5 h-1.5 bg-pink-300 rounded-full animate-float"
                  style={{ animationDelay: "0.1s" }}
                />
                <div
                  className="absolute top-0 -right-3 w-1 h-1 bg-pink-200 rounded-full animate-float"
                  style={{ animationDelay: "0.2s" }}
                />
              </>
            )}
          </div>
        </div>
      </div>

      {/* Static glow effect for liked songs */}
      {song.is_liked && !likeLoading && !isAnimating && (
        <div className="absolute -inset-1 pointer-events-none">
          <div className="absolute inset-0 rounded-2xl bg-linear-to-br from-pink-500/10 via-transparent to-transparent animate-pulse-slow"></div>
        </div>
      )}
    </div>
  );
};

// CSS animations for the component
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

export default PopularCard;
