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
  const [showActions, setShowActions] = useState(false);
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

  const handleCardClick = (_e: React.MouseEvent) => {
    navigate(`/song/${song.id}`);
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
      onClick={handleCardClick}
      className={`
        group relative bg-gray-900/40 backdrop-blur-sm rounded-xl overflow-hidden
        transition-all duration-200 active:scale-[0.98]
        ${
          isPlaying
            ? "ring-2 ring-purple-500 shadow-lg shadow-purple-500/20"
            : "border border-gray-800/50"
        }
      `}
    >
      {/* Album Art - Full width top */}
      <div className="relative aspect-square">
        <img
          src={song.image_url || "/placeholder-album.jpg"}
          alt={song.title}
          className="w-full h-full object-cover"
        />

        {/* linear Overlay */}
        <div className="absolute inset-0 bg-linear-to-t from-black/80 via-transparent to-transparent"></div>

        {/* Minimal Play Button Overlay */}
        <button
          onClick={handlePlay}
          disabled={playLoading}
          className="
            absolute inset-0 flex items-center justify-center
            transition-opacity duration-200
            hover:bg-black/20 active:bg-black/40
          "
        >
          {playLoading ? (
            <Loader2 className="w-10 h-10 text-white animate-spin drop-shadow-lg" />
          ) : isPlaying ? (
            <div className="relative">
              <div className="absolute -inset-2 bg-purple-500/30 rounded-full blur-md"></div>
              <Pause className="relative w-10 h-10 text-white drop-shadow-lg" />
            </div>
          ) : (
            <div className="relative opacity-0 group-hover:opacity-100 transition-opacity">
              <div className="absolute -inset-2 bg-black/50 rounded-full blur-md"></div>
              <Play className="relative w-10 h-10 text-white drop-shadow-lg" />
            </div>
          )}
        </button>

        {/* Playing Indicator (top right) */}
        {isPlaying && !playLoading && (
          <div className="absolute top-2 right-2">
            <div className="relative">
              <div className="absolute inset-0 bg-purple-500 rounded-full animate-ping"></div>
              <div className="relative w-2.5 h-2.5 bg-purple-500 rounded-full ring-2 ring-black"></div>
            </div>
          </div>
        )}

        {/* Queue Actions Button (top left) */}
        {showQueueActions && (
          <div className="absolute top-2 left-2">
            <button
              onClick={(e) => {
                e.stopPropagation();
                setShowActions(!showActions);
              }}
              className="w-8 h-8 bg-black/60 backdrop-blur rounded-full flex items-center justify-center active:bg-black/80 transition-colors"
            >
              <MoreHorizontal className="w-4 h-4 text-white" />
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

                <div className="absolute left-0 top-full mt-1 z-50 min-w-40">
                  <div className="bg-gray-900 rounded-xl border border-gray-800 shadow-xl overflow-hidden backdrop-blur">
                    <button
                      onClick={handleAddToQueue}
                      className="w-full px-4 py-3 flex items-center gap-3 text-left hover:bg-gray-800 active:bg-gray-700 transition-colors"
                    >
                      <Plus className="w-4 h-4 text-purple-400" />
                      <span className="text-sm text-white">Add to Queue</span>
                    </button>
                    <button
                      onClick={handlePlayNext}
                      className="w-full px-4 py-3 flex items-center gap-3 text-left hover:bg-gray-800 active:bg-gray-700 transition-colors border-t border-gray-800"
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

      {/* Content Section */}
      <div className="p-3">
        {/* Title and Artist */}
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1 min-w-0">
            <h3
              className={`
              font-semibold truncate
              ${compact ? "text-sm" : "text-base"}
              ${isPlaying ? "text-purple-400" : "text-white"}
            `}
            >
              {song.title}
            </h3>
            <p
              className={`
              truncate text-gray-400
              ${compact ? "text-xs" : "text-sm"}
            `}
            >
              {song.artist}
            </p>
          </div>

          {/* Like Button */}
          <button
            onClick={handleLike}
            disabled={likeLoading || isAnimating}
            className={`
              relative shrink-0 p-2 rounded-full transition-all duration-200
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
        </div>

        {/* Metadata Row */}
        <div className="flex items-center gap-2 mt-2">
          {/* Genre Tag */}
          {song.genre && (
            <span className="text-xs text-purple-400 bg-purple-900/30 px-2 py-0.5 rounded-full">
              {song.genre}
            </span>
          )}

          {/* Duration */}
          <span className="text-xs text-gray-500">
            {formatDuration(song.duration_ms)}
          </span>

          {/* Popularity Dots */}
          {!compact && song.popularity && (
            <>
              <span className="text-gray-600">•</span>
              <div className="flex items-center gap-0.5">
                {[...Array(5)].map((_, i) => (
                  <div
                    key={i}
                    className={`
                      w-1 h-1 rounded-full
                      ${
                        i < Math.floor((song.popularity ?? 0) / 20)
                          ? "bg-purple-400"
                          : "bg-gray-700"
                      }
                    `}
                  />
                ))}
              </div>
            </>
          )}
        </div>
      </div>

      {/* Like Animation Particles */}
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

export default PopularCard;
