import React, { useState, useEffect } from "react";
import YouTube from "react-youtube";
import type { YouTubeProps, YouTubePlayer } from "react-youtube";

interface YoutubeAudioPlayerProps {
  videoId: string;
  onReady?: (player: YouTubePlayer) => void;
  onStateChange?: (state: number) => void;
  isVisible?: boolean;
  startSeconds?: number;
  endSeconds?: number;
}

const YoutubeAudioPlayer: React.FC<YoutubeAudioPlayerProps> = ({
  videoId,
  onReady,
  onStateChange,
  isVisible = false,
  startSeconds = 0,
  endSeconds,
}) => {
  const [player, setPlayer] = useState<YouTubePlayer | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(100);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  const opts: YouTubeProps["opts"] = {
    height: isVisible ? "200" : "0",
    width: isVisible ? "300" : "0",
    playerVars: {
      autoplay: 0,
      controls: isVisible ? 1 : 0,
      disablekb: 0,
      fs: 0,
      modestbranding: 1,
      rel: 0,
      showinfo: 0,
      start: startSeconds,
      end: endSeconds,
      iv_load_policy: 3,
      playsinline: 1,
    },
  };

  const onPlayerReady: YouTubeProps["onReady"] = (event) => {
    const player = event.target;
    setPlayer(player);

    player.getDuration().then((dur: number) => {
      setDuration(dur);
    });

    player.setVolume(volume);

    if (onReady) {
      onReady(player);
    }
  };

  const onPlayerStateChange: YouTubeProps["onStateChange"] = (event) => {
    const state = event.data;
    setIsPlaying(state === 1);

    if (player && (state === 1 || state === 2)) {
      player.getCurrentTime().then((time: number) => {
        setCurrentTime(time);
      });
    }

    if (onStateChange) {
      onStateChange(state);
    }
  };

  // PERBAIKAN: Menggunakan number untuk browser environment
  useEffect(() => {
    let interval: number;

    if (isPlaying && player) {
      interval = window.setInterval(() => {
        player.getCurrentTime().then((time: number) => {
          setCurrentTime(time);
        });
      }, 1000);
    }

    return () => {
      if (interval) {
        window.clearInterval(interval);
      }
    };
  }, [isPlaying, player]);

  // Fungsi kontrol player
  const play = () => {
    if (player) {
      player.playVideo();
    }
  };

  const pause = () => {
    if (player) {
      player.pauseVideo();
    }
  };

  const seekTo = (seconds: number) => {
    if (player) {
      player.seekTo(seconds, true);
      setCurrentTime(seconds);
    }
  };

  const setPlayerVolume = (vol: number) => {
    if (player) {
      player.setVolume(vol);
      setVolume(vol);
    }
  };

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
  };

  const handleSeekChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTime = parseFloat(e.target.value);
    seekTo(newTime);
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseInt(e.target.value);
    setPlayerVolume(newVolume);
  };

  return (
    <div className="youtube-audio-player">
      {/* Player YouTube */}
      {isVisible ? (
        <YouTube
          videoId={videoId}
          opts={opts}
          onReady={onPlayerReady}
          onStateChange={onPlayerStateChange}
        />
      ) : (
        <div style={{ display: "none" }}>
          <YouTube
            videoId={videoId}
            opts={opts}
            onReady={onPlayerReady}
            onStateChange={onPlayerStateChange}
          />
        </div>
      )}

      {/* Kontrol Audio Custom */}
      <div className="audio-controls">
        <div className="playback-controls">
          <button onClick={play} disabled={!player}>
            ▶️ Play
          </button>
          <button onClick={pause} disabled={!player || !isPlaying}>
            ⏸️ Pause
          </button>
        </div>

        <div className="time-controls">
          <span>{formatTime(currentTime)}</span>
          <input
            type="range"
            min="0"
            max={duration || 100}
            value={currentTime}
            onChange={handleSeekChange}
            className="seek-slider"
            disabled={!player}
          />
          <span>{formatTime(duration)}</span>
        </div>

        <div className="volume-controls">
          <span>🔊 Volume:</span>
          <input
            type="range"
            min="0"
            max="100"
            value={volume}
            onChange={handleVolumeChange}
            className="volume-slider"
            disabled={!player}
          />
          <span>{volume}%</span>
        </div>

        <div className="player-info">
          <p>
            Status: {isPlaying ? "⏵ Playing" : "⏸ Paused"} | Video ID: {videoId}
          </p>
        </div>
      </div>
    </div>
  );
};

export default YoutubeAudioPlayer;
