import { useEffect, useRef, useState } from "react";
import type { Song } from "../apis/models/models";
import useApi from "../apis/api";
import { songResourceApiYoutube } from "../apis/endpoints/song";
import YouTube from "react-youtube";
import type { YouTubeProps } from "react-youtube";

interface MusicPlayerProps {
  currentSong: Song | null;
  isPlaying: boolean;
  onPlayPause: () => void;
  onNext: () => void;
  onPrevious: () => void;
  onSeek: (time: number) => void;
}

const MusicPlayer: React.FC<MusicPlayerProps> = ({
  currentSong,
  isPlaying,
  onPlayPause,
  onNext,
  onPrevious,
  onSeek,
}) => {
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [youtubeId, setYoutubeId] = useState<string | null>(null);
  const [isReady, setIsReady] = useState(false);

  const playerRef = useRef<any>(null);
  const progressInterval = useRef<number | null>(null);
  const songResource = useApi({ api: songResourceApiYoutube });

  // 1. Ambil Data YouTube ID dari API Backend
  useEffect(() => {
    if (currentSong?.id) {
      console.log("🎵 Loading song:", currentSong.title);
      setYoutubeId(null);
      setCurrentTime(0);
      setDuration(0);
      setIsReady(false);

      // Hit API untuk mendapatkan youtube_id
      songResource.process({ id: currentSong.id });
    }
  }, [currentSong?.id]);

  // 2. Set YouTube ID setelah API response sukses
  useEffect(() => {
    if (songResource.data?.data.video_id) {
      setYoutubeId(songResource.data.data.video_id);
    }
  }, [songResource.data]);

  // 3. Logic untuk Update Progress Bar (Interval)
  const startTimer = () => {
    if (progressInterval.current) clearInterval(progressInterval.current);
    progressInterval.current = setInterval(() => {
      if (playerRef.current && isReady) {
        const curr = playerRef.current.getCurrentTime();
        setCurrentTime(curr);
        // Kirim progress ke parent jika diperlukan (%)
        if (duration > 0) {
          onSeek((curr / duration) * 100);
        }
      }
    }, 1000);
  };

  const stopTimer = () => {
    if (progressInterval.current) clearInterval(progressInterval.current);
  };

  // 4. Sinkronisasi State isPlaying dengan YouTube Engine
  useEffect(() => {
    if (!playerRef.current || !isReady) return;

    if (isPlaying) {
      playerRef.current.playVideo();
      startTimer();
    } else {
      playerRef.current.pauseVideo();
      stopTimer();
    }

    return () => stopTimer();
  }, [isPlaying, isReady]);

  // 5. YouTube Player Callbacks
  const onPlayerReady: YouTubeProps["onReady"] = (event) => {
    playerRef.current = event.target;
    setIsReady(true);
    setDuration(event.target.getDuration());

    if (isPlaying) {
      event.target.playVideo();
      startTimer();
    }
  };

  const onPlayerStateChange: YouTubeProps["onStateChange"] = (event) => {
    // State 0 = ENDED
    if (event.data === 0) {
      onNext();
    }
    // State 1 = PLAYING, State 2 = PAUSED
    if (event.data === 1) startTimer();
    else stopTimer();
  };

  const handleSeekInternal = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTime = parseFloat(e.target.value);
    setCurrentTime(newTime);
    if (playerRef.current) {
      playerRef.current.seekTo(newTime, true);
    }
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
  };

  const opts: YouTubeProps["opts"] = {
    height: "0",
    width: "0",
    playerVars: {
      autoplay: 1,
      controls: 0,
      disablekb: 1,
      modestbranding: 1,
    },
  };

  if (!currentSong) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-black/95 border-t border-zinc-800 z-50 p-3">
      {/* Hidden YouTube Engine */}
      {youtubeId && (
        <div style={{ position: "absolute", visibility: "hidden" }}>
          <YouTube
            videoId={youtubeId}
            opts={opts}
            onReady={onPlayerReady}
            onStateChange={onPlayerStateChange}
            onError={(err) => console.error("YT Error:", err)}
          />
        </div>
      )}

      <div className="container mx-auto">
        {/* Progress Bar */}
        <div className="flex items-center gap-2 mb-2">
          <span className="text-[10px] text-zinc-400 w-8 text-right">
            {formatTime(currentTime)}
          </span>
          <input
            type="range"
            min="0"
            max={duration || 100}
            value={currentTime}
            onChange={handleSeekInternal}
            className="grow h-1 bg-zinc-600 rounded-lg appearance-none cursor-pointer accent-green-500"
            disabled={!isReady}
          />
          <span className="text-[10px] text-zinc-400 w-8">
            {formatTime(duration)}
          </span>
        </div>

        <div className="flex items-center justify-between">
          {/* Song Info */}
          <div className="flex items-center w-1/3">
            <img
              src={currentSong.image_url || "/default-album.png"}
              alt={currentSong.title}
              className="w-10 h-10 rounded mr-3 object-cover"
            />
            <div className="truncate">
              <h4 className="text-white text-sm font-medium truncate">
                {currentSong.title}
              </h4>
              <p className="text-zinc-400 text-xs truncate">
                {currentSong.artist}
              </p>
            </div>
          </div>

          {/* Player Controls */}
          <div className="flex items-center gap-4">
            <button
              onClick={onPrevious}
              className="text-zinc-400 hover:text-white transition disabled:opacity-50"
              disabled={!isReady}
            >
              <i className="fas fa-step-backward text-lg"></i>
            </button>
            <button
              onClick={onPlayPause}
              className="w-8 h-8 flex items-center justify-center bg-white text-black rounded-full hover:scale-105 transition disabled:opacity-50"
              disabled={!isReady || !youtubeId}
            >
              {!isReady ? (
                <i className="fas fa-spinner fa-spin text-sm"></i>
              ) : (
                <i
                  className={`fas ${
                    isPlaying ? "fa-pause" : "fa-play"
                  } text-sm`}
                ></i>
              )}
            </button>
            <button
              onClick={onNext}
              className="text-zinc-400 hover:text-white transition disabled:opacity-50"
              disabled={!isReady}
            >
              <i className="fas fa-step-forward text-lg"></i>
            </button>
          </div>

          <div className="w-1/3 flex justify-end items-center">
            {!isReady && youtubeId && (
              <span className="text-xs text-yellow-400 mr-2 animate-pulse">
                Loading...
              </span>
            )}
            <i className="fas fa-volume-up text-zinc-400"></i>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MusicPlayer;
