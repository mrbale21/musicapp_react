// components/BottomPlayer.tsx - Versi minimalis untuk mobile
import React, { useState, useRef, useEffect } from "react";
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Volume2,
  VolumeX,
  Shuffle,
  Repeat,
  Repeat1,
  ChevronUp,
  ChevronDown,
} from "lucide-react";
import { usePlayer } from "../context/PlayerContext";
import LikeButton from "./LikedButton";
import { formatTime } from "../utils/formatTime";
import { useSongInteractions } from "../hooks/useSongsInteractions";
import { useUserData } from "../hooks/zustand";

const BottomPlayer: React.FC = () => {
  const {
    currentSong,
    isPlaying,
    progress,
    togglePlay,
    setProgress,
    nextSong,
    prevSong,
    volume: contextVolume,
    setVolume,
    queue,
    currentIndex,
    repeatMode,
    shuffleQueue,
    setRepeatMode,
    isShuffled,
    playbackError,
    duration,
    updateCurrentSong,
  } = usePlayer();

  const [volume, setLocalVolume] = useState(contextVolume);
  const [isMuted, setIsMuted] = useState(false);
  const [showQueue, setShowQueue] = useState(false);
  const [showVolume, setShowVolume] = useState(false);
  const prevVolumeRef = useRef(contextVolume);
  const { user, setUser } = useUserData();

  const { handleLike } = useSongInteractions({
    onUpdateSong: (songId, updates) => {
      if (currentSong?.id === songId) {
        updateCurrentSong(updates);
      }
      // Sync with zustand (profile likes count)
      if (user && updates.is_liked !== undefined) {
        const userLikes = user.likes || [];
        if (updates.is_liked) {
          setUser({ ...user, likes: [...userLikes, { id: songId, song_id: songId } as any] });
        } else {
          setUser({ ...user, likes: userLikes.filter((l: any) => l.song_id !== songId) });
        }
      }
    },
  });

  useEffect(() => {
    setLocalVolume(contextVolume);
  }, [contextVolume]);

  if (!currentSong) return null;

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseInt(e.target.value);
    setLocalVolume(newVolume);
    setVolume(newVolume);
    setIsMuted(newVolume === 0);
  };

  const toggleMute = () => {
    if (isMuted) {
      const prevVol = prevVolumeRef.current;
      setLocalVolume(prevVol);
      setVolume(prevVol);
      setIsMuted(false);
    } else {
      prevVolumeRef.current = volume;
      setLocalVolume(0);
      setVolume(0);
      setIsMuted(true);
    }
  };

  const cycleRepeatMode = () => {
    const modes: Array<"off" | "one" | "all"> = ["off", "all", "one"];
    const currentIndex = modes.indexOf(repeatMode);
    const nextIndex = (currentIndex + 1) % modes.length;
    setRepeatMode(modes[nextIndex]);
  };

  return (
    <>
      {/* Main Player Bar - Tetap terlihat */}
      <div className="fixed bottom-0 left-0 right-0 bg-linear-to-t from-black/95 to-zinc-900/95 backdrop-blur-lg border-t border-white/10 p-3 z-50">
        <div className="max-w-md mx-auto">
          {/* Minimal Song Info */}
          <div className="flex items-center gap-3 mb-3">
            <div className="relative">
              <img
                src={currentSong.image_url}
                alt={currentSong.title}
                className="w-12 h-12 rounded-lg object-cover"
              />
              {isPlaying && (
                <div className="absolute inset-0 bg-black/40 rounded-lg flex items-center justify-center">
                  <div className="flex gap-0.5">
                    <div className="w-0.5 h-3 bg-green-500 animate-pulse"></div>
                    <div
                      className="w-0.5 h-4 bg-green-500 animate-pulse"
                      style={{ animationDelay: "0.1s" }}
                    ></div>
                    <div
                      className="w-0.5 h-2 bg-green-500 animate-pulse"
                      style={{ animationDelay: "0.2s" }}
                    ></div>
                  </div>
                </div>
              )}
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <div className="min-w-0">
                  <h4 className="text-sm font-medium text-white truncate">
                    {currentSong.title}
                  </h4>
                  <p className="text-xs text-zinc-400 truncate">
                    {currentSong.artist}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <LikeButton
                    isLiked={currentSong.is_liked ? true : false}
                    onClick={() => handleLike(currentSong)}
                  />
                  <button
                    onClick={() => setShowQueue(!showQueue)}
                    className="text-zinc-400 hover:text-white p-1"
                  >
                    {showQueue ? (
                      <ChevronDown className="w-4 h-4" />
                    ) : (
                      <ChevronUp className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>

              {/* Progress Bar Minimal */}
              <div className="mt-2">
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={progress}
                  onChange={(e) => setProgress(Number(e.target.value))}
                  className="w-full h-1 bg-white/20 rounded-full appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white"
                  style={{
                    background: `linear-gradient(to right, #ffffff ${progress}%, rgba(255,255,255,0.2) ${progress}%)`,
                  }}
                />
                <div className="flex justify-between text-xs text-zinc-400 mt-1">
                  <span>
                    {formatTime(
                      duration > 0 ? (progress / 100) * duration : (progress / 100) * (currentSong.duration_ms || 0),
                    )}
                  </span>
                  <span>{formatTime(duration > 0 ? duration : (currentSong.duration_ms || 0))}</span>
                </div>
                {playbackError && (
                  <div className="mt-1 text-[10px] text-red-400">
                    {playbackError}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Compact Controls */}
          <div className="flex items-center justify-between">
            {/* Left - Shuffle & Volume */}
            <div className="flex items-center gap-3">
              <button
                onClick={shuffleQueue}
                className={`p-1.5 rounded-full transition-colors ${
                  isShuffled
                    ? "bg-green-500/20 text-green-500"
                    : "text-zinc-400 hover:text-white hover:bg-white/10"
                }`}
              >
                <Shuffle className="w-4 h-4" />
              </button>

              <div className="relative">
                <button
                  onClick={toggleMute}
                  className="p-1.5 rounded-full text-zinc-400 hover:text-white hover:bg-white/10 transition-colors"
                  onTouchStart={() => setShowVolume(!showVolume)}
                >
                  {isMuted ? (
                    <VolumeX className="w-4 h-4" />
                  ) : (
                    <Volume2 className="w-4 h-4" />
                  )}
                </button>

                {/* Volume Slider Popup */}
                {showVolume && (
                  <div className="absolute bottom-full left-0 mb-2 p-2 bg-black/90 backdrop-blur-lg rounded-lg">
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={volume}
                      onChange={handleVolumeChange}
                      className="w-32 h-1 bg-white/20 rounded-full appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white"
                      style={{
                        background: `linear-gradient(to right, #ffffff ${volume}%, rgba(255,255,255,0.2) ${volume}%)`,
                      }}
                    />
                  </div>
                )}
              </div>
            </div>

            {/* Center - Playback Controls */}
            <div className="flex items-center gap-2">
              <button
                onClick={prevSong}
                disabled={currentIndex <= 0 && repeatMode === "off"}
                className={`p-2.5 rounded-full ${
                  currentIndex <= 0 && repeatMode === "off"
                    ? "text-zinc-600 cursor-not-allowed"
                    : "text-white hover:bg-white/10"
                }`}
              >
                <SkipBack className="w-5 h-5" />
              </button>

              <button
                onClick={togglePlay}
                className="w-12 h-12 bg-white rounded-full flex items-center justify-center hover:scale-105 active:scale-95 transition-all shadow-lg"
              >
                {isPlaying ? (
                  <Pause className="w-5 h-5 text-black" />
                ) : (
                  <Play className="w-5 h-5 text-black ml-0.5" />
                )}
              </button>

              <button
                onClick={nextSong}
                disabled={
                  currentIndex >= queue.length - 1 && repeatMode === "off"
                }
                className={`p-2.5 rounded-full ${
                  currentIndex >= queue.length - 1 && repeatMode === "off"
                    ? "text-zinc-600 cursor-not-allowed"
                    : "text-white hover:bg-white/10"
                }`}
              >
                <SkipForward className="w-5 h-5" />
              </button>
            </div>

            {/* Right - Repeat & Queue Info */}
            <div className="flex items-center gap-3">
              <button
                onClick={cycleRepeatMode}
                className={`p-1.5 rounded-full transition-colors ${
                  repeatMode === "off"
                    ? "text-zinc-400 hover:text-white hover:bg-white/10"
                    : "bg-green-500/20 text-green-500"
                }`}
              >
                {repeatMode === "one" ? (
                  <Repeat1 className="w-4 h-4" />
                ) : (
                  <Repeat className="w-4 h-4" />
                )}
              </button>

              {queue.length > 0 && !showQueue && (
                <div className="text-xs text-zinc-400 px-2 py-1 bg-white/5 rounded-full">
                  {currentIndex + 1}/{queue.length}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Queue Panel - Slide Up */}
      {showQueue && queue.length > 0 && (
        <div className="fixed inset-x-0 bottom-20 z-40 animate-slideUp">
          <div className="max-w-md mx-auto px-3">
            <div className="bg-black/90 backdrop-blur-xl rounded-xl border border-white/10 p-4 shadow-2xl">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <h4 className="text-sm font-semibold text-white">Queue</h4>
                  <p className="text-xs text-zinc-400">{queue.length} songs</p>
                </div>
                <button
                  onClick={() => setShowQueue(false)}
                  className="text-zinc-400 hover:text-white p-1"
                >
                  <ChevronDown className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-2 max-h-60 overflow-y-auto">
                {queue.map((song, index) => (
                  <div
                    key={`${song.id}-${index}`}
                    className={`flex items-center gap-3 p-2 rounded-lg transition-colors ${
                      index === currentIndex
                        ? "bg-white/10"
                        : "hover:bg-white/5"
                    }`}
                  >
                    <div className="relative">
                      <img
                        src={song.image_url}
                        alt={song.title}
                        className="w-10 h-10 rounded-lg object-cover"
                      />
                      {index === currentIndex && (
                        <div className="absolute inset-0 bg-green-500/20 rounded-lg flex items-center justify-center">
                          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p
                        className={`text-sm truncate ${
                          index === currentIndex
                            ? "text-white font-medium"
                            : "text-zinc-300"
                        }`}
                      >
                        {song.title}
                      </p>
                      <p className="text-xs text-zinc-400 truncate">
                        {song.artist}
                      </p>
                    </div>
                    <div className="text-xs text-zinc-500">
                      {formatTime(song.duration_ms || 0)}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default BottomPlayer;
