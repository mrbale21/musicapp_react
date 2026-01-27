// context/YouTubePlayerContext.tsx - Perbaikan COMPLETE
import React, {
  createContext,
  useContext,
  useState,
  useRef,
  useEffect,
  useCallback,
} from "react";
import type { Song } from "../apis/models/models";

interface YouTubePlayerContextType {
  currentYouTubeSong: Song | null;
  isYouTubePlaying: boolean;
  youtubeProgress: number;
  youtubeDuration: number;
  youtubeVolume: number;
  youtubeCurrentTime: number; // Tambah ini
  playYouTubeSong: (song: Song) => void;
  pauseYouTubeSong: () => void;
  seekYouTube: (seconds: number) => void;
  changeYouTubeVolume: (volume: number) => void;
  toggleYouTubePlay: () => void;
  nextYouTubeSong: () => void;
  prevYouTubeSong: () => void;
  clearYouTubePlayer: () => void;
}

const YouTubePlayerContext = createContext<
  YouTubePlayerContextType | undefined
>(undefined);

export const useYouTubePlayer = () => {
  const context = useContext(YouTubePlayerContext);
  if (!context) {
    throw new Error(
      "useYouTubePlayer must be used within YouTubePlayerProvider"
    );
  }
  return context;
};

export const YouTubePlayerProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [currentYouTubeSong, setCurrentYouTubeSong] = useState<Song | null>(
    null
  );
  const [isYouTubePlaying, setIsYouTubePlaying] = useState(false);
  const [youtubeProgress, setYouTubeProgress] = useState(0);
  const [youtubeDuration, setYouTubeDuration] = useState(0);
  const [youtubeCurrentTime, setYouTubeCurrentTime] = useState(0); // State baru
  const [youtubeVolume, setYouTubeVolumeState] = useState(80);

  // Refs
  const playerRef = useRef<any>(null);
  const progressIntervalRef = useRef<number | null>(null);
  const [isPlayerReady, setIsPlayerReady] = useState(false);

  // Fungsi untuk update progress
  const updateProgress = useCallback(() => {
    if (!playerRef.current || !isPlayerReady) return;

    try {
      const currentTime = playerRef.current.getCurrentTime();
      const duration = playerRef.current.getDuration();

      if (duration > 0) {
        setYouTubeCurrentTime(currentTime);
        setYouTubeDuration(duration);
        const progress = (currentTime / duration) * 100;
        setYouTubeProgress(progress);

        // Debug log
        console.log("Progress Update:", {
          currentTime: Math.floor(currentTime),
          duration: Math.floor(duration),
          progress: Math.floor(progress),
        });
      }
    } catch (error) {
      console.error("Error updating progress:", error);
    }
  }, [isPlayerReady]);

  // Start progress tracking
  const startProgressTracking = useCallback(() => {
    if (progressIntervalRef.current) {
      clearInterval(progressIntervalRef.current);
    }

    console.log("Starting progress tracking...");
    progressIntervalRef.current = setInterval(() => {
      updateProgress();
    }, 1000); // Update setiap detik
  }, [updateProgress]);

  // Stop progress tracking
  const stopProgressTracking = useCallback(() => {
    if (progressIntervalRef.current) {
      console.log("Stopping progress tracking");
      clearInterval(progressIntervalRef.current);
      progressIntervalRef.current = null;
    }
  }, []);

  // Initialize YouTube API
  useEffect(() => {
    // Load YouTube IFrame API jika belum ada
    if (!window.YT) {
      const tag = document.createElement("script");
      tag.src = "https://www.youtube.com/iframe_api";
      const firstScriptTag = document.getElementsByTagName("script")[0];
      firstScriptTag.parentNode?.insertBefore(tag, firstScriptTag);
    }

    // Global callback untuk YouTube API
    (window as any).onYouTubeIframeAPIReady = () => {
      console.log("YouTube IFrame API Ready!");
    };

    return () => {
      stopProgressTracking();
    };
  }, [stopProgressTracking]);

  // Fungsi untuk membuat player baru
  const createPlayer = useCallback(
    (song: Song) => {
      if (!song.youtube_id) {
        console.error("No YouTube ID for this song");
        return;
      }

      console.log("Creating YouTube player for:", song.youtube_id);

      // Hancurkan player lama jika ada
      if (playerRef.current) {
        playerRef.current.destroy();
        playerRef.current = null;
      }

      // Buat player baru
      playerRef.current = new (window as any).YT.Player("youtube-player", {
        height: "0",
        width: "0",
        videoId: song.youtube_id,
        playerVars: {
          autoplay: 1,
          controls: 0,
          disablekb: 1,
          fs: 0,
          modestbranding: 1,
          rel: 0,
          showinfo: 0,
          iv_load_policy: 3,
          playsinline: 1,
          // Optimasi untuk audio
          quality: "small",
          format: "audioonly",
        },
        events: {
          onReady: (event: any) => {
            console.log("YouTube Player Ready!");
            setIsPlayerReady(true);
            event.target.setVolume(youtubeVolume);

            const duration = event.target.getDuration();
            setYouTubeDuration(duration);
            console.log("Duration:", duration);

            // Mulai tracking setelah player ready
            setTimeout(() => {
              startProgressTracking();
            }, 500);
          },
          onStateChange: (event: any) => {
            console.log("YouTube Player State:", event.data);

            switch (event.data) {
              case 1: // Playing
                setIsYouTubePlaying(true);
                startProgressTracking();
                break;

              case 2: // Paused
                setIsYouTubePlaying(false);
                stopProgressTracking();
                break;

              case 0: // Ended
                setIsYouTubePlaying(false);
                setYouTubeProgress(100);
                setYouTubeCurrentTime(youtubeDuration);
                stopProgressTracking();
                break;

              case 3: // Buffering
                // Bisa tambahkan loading state jika perlu
                break;
            }
          },
          onError: (error: any) => {
            console.error("YouTube Player Error:", error);
            setIsPlayerReady(false);
          },
          onPlaybackQualityChange: (event: any) => {
            console.log("Playback quality:", event.data);
          },
          onPlaybackRateChange: (event: any) => {
            console.log("Playback rate:", event.data);
          },
        },
      });
    },
    [
      youtubeVolume,
      startProgressTracking,
      stopProgressTracking,
      youtubeDuration,
    ]
  );

  // Play YouTube song
  const playYouTubeSong = useCallback(
    (song: Song) => {
      console.log("Play YouTube Song:", song.title);
      setCurrentYouTubeSong(song);

      // Reset progress
      setYouTubeProgress(0);
      setYouTubeCurrentTime(0);
      setIsPlayerReady(false);

      // Buat player baru atau load video
      if (!playerRef.current) {
        createPlayer(song);
      } else {
        // Jika player sudah ada, load video baru
        playerRef.current.loadVideoById(song.youtube_id);
        setTimeout(() => {
          setIsPlayerReady(true);
          startProgressTracking();
        }, 1000);
      }
    },
    [createPlayer, startProgressTracking]
  );

  // Pause
  const pauseYouTubeSong = useCallback(() => {
    if (playerRef.current && isPlayerReady) {
      playerRef.current.pauseVideo();
    }
    setIsYouTubePlaying(false);
    stopProgressTracking();
  }, [isPlayerReady, stopProgressTracking]);

  // Toggle play/pause
  const toggleYouTubePlay = useCallback(() => {
    if (!currentYouTubeSong || !isPlayerReady) return;

    if (isYouTubePlaying) {
      pauseYouTubeSong();
    } else {
      if (playerRef.current) {
        playerRef.current.playVideo();
      }
    }
  }, [currentYouTubeSong, isPlayerReady, isYouTubePlaying, pauseYouTubeSong]);

  // Seek
  const seekYouTube = useCallback(
    (seconds: number) => {
      if (playerRef.current && isPlayerReady) {
        playerRef.current.seekTo(seconds, true);

        // Update progress langsung
        const duration = playerRef.current.getDuration();
        if (duration > 0) {
          setYouTubeCurrentTime(seconds);
          const progress = (seconds / duration) * 100;
          setYouTubeProgress(progress);
        }
      }
    },
    [isPlayerReady]
  );

  // Change volume
  const changeYouTubeVolume = useCallback(
    (volume: number) => {
      if (playerRef.current && isPlayerReady) {
        playerRef.current.setVolume(volume);
      }
      setYouTubeVolumeState(volume);
    },
    [isPlayerReady]
  );

  // Clear player
  const clearYouTubePlayer = useCallback(() => {
    if (playerRef.current) {
      playerRef.current.destroy();
      playerRef.current = null;
    }
    setCurrentYouTubeSong(null);
    setIsYouTubePlaying(false);
    setIsPlayerReady(false);
    setYouTubeProgress(0);
    setYouTubeCurrentTime(0);
    setYouTubeDuration(0);
    stopProgressTracking();
  }, [stopProgressTracking]);

  // Next song
  const nextYouTubeSong = useCallback(() => {
    console.log("Next song");
    // Implement logic
  }, []);

  // Previous song
  const prevYouTubeSong = useCallback(() => {
    console.log("Previous song");
    // Implement logic
  }, []);

  const value = {
    currentYouTubeSong,
    isYouTubePlaying,
    youtubeProgress,
    youtubeDuration,
    youtubeCurrentTime, // Export current time
    youtubeVolume,
    playYouTubeSong,
    pauseYouTubeSong,
    seekYouTube,
    changeYouTubeVolume,
    toggleYouTubePlay,
    nextYouTubeSong,
    prevYouTubeSong,
    clearYouTubePlayer,
  };

  return (
    <YouTubePlayerContext.Provider value={value}>
      {children}
      {/* Hidden YouTube Player */}
      <div
        id="youtube-player"
        style={{
          position: "absolute",
          top: "-1000px",
          left: "-1000px",
          width: "0",
          height: "0",
          opacity: 0,
          pointerEvents: "none",
        }}
      />

      {/* Debug Panel - Gunakan cara lain untuk development */}
      {import.meta.env?.DEV && ( // Gunakan Vite/React env
        <div
          style={{
            position: "fixed",
            bottom: "100px",
            right: "10px",
            background: "rgba(0,0,0,0.7)",
            color: "white",
            padding: "10px",
            fontSize: "12px",
            zIndex: 9999,
            borderRadius: "5px",
            display: isPlayerReady ? "block" : "none", // Hanya tampil saat ready
          }}
        >
          <div>🎵 YouTube Player Debug:</div>
          <div>Ready: {isPlayerReady ? "✅" : "❌"}</div>
          <div>Playing: {isYouTubePlaying ? "▶️" : "⏸️"}</div>
          <div>Progress: {youtubeProgress.toFixed(1)}%</div>
          <div>
            Time: {Math.floor(youtubeCurrentTime)}s /{" "}
            {Math.floor(youtubeDuration)}s
          </div>
          <div>Volume: {youtubeVolume}%</div>
          <button
            onClick={() => updateProgress()}
            style={{
              marginTop: "5px",
              padding: "2px 5px",
              fontSize: "10px",
              background: "#444",
              color: "white",
              border: "none",
              borderRadius: "3px",
            }}
          >
            Force Update
          </button>
        </div>
      )}
    </YouTubePlayerContext.Provider>
  );
};
