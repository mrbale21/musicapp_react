// context/PlayerContext.tsx - VERSI LENGKAP DENG SEMUA FUNCTION
import React, {
  createContext,
  useContext,
  useState,
  useRef,
  useEffect,
  useCallback,
  useMemo,
} from "react";
import type { Song } from "../apis/models/models";
import { songResourceApiYoutube } from "../apis/endpoints/song";
import { recommendationContentApi } from "../apis/endpoints/recommendation";

interface PlayerContextType {
  // State
  currentSong: Song | null;
  isPlaying: boolean;
  progress: number;
  volume: number;
  currentTime: number;
  duration: number;
  playbackError: string | null; // ⭐ Add error state

  // Playlist
  queue: Song[];
  currentIndex: number;
  isShuffled: boolean;
  repeatMode: "off" | "one" | "all";

  // Actions
  play: (song: Song) => void;
  playSong: (song: Song) => void;
  pause: () => void;
  togglePlay: () => void;
  setProgress: (progress: number) => void;
  setVolume: (volume: number) => void;
  seekTo: (seconds: number) => void;
  nextSong: () => void;
  prevSong: () => void;
  clearPlayer: () => void;

  // Playlist actions
  addToQueue: (song: Song) => void;
  addMultipleToQueue: (songs: Song[]) => void;
  removeFromQueue: (index: number) => void;
  clearQueue: () => void;
  shuffleQueue: () => void;
  setRepeatMode: (mode: "off" | "one" | "all") => void;
  playNext: (song: Song) => void;
}

const PlayerContext = createContext<PlayerContextType | undefined>(undefined);

export const usePlayer = () => {
  const context = useContext(PlayerContext);
  if (!context) {
    throw new Error("usePlayer must be used within PlayerProvider");
  }
  return context;
};

export const PlayerProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  // Player state
  const [currentSong, setCurrentSong] = useState<Song | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [volume, setVolumeState] = useState(80);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [playbackError, setPlaybackError] = useState<string | null>(null); // ⭐ Add error state

  // Playlist state
  const [queue, setQueue] = useState<Song[]>([]);
  const [currentIndex, setCurrentIndex] = useState<number>(-1);
  const [isShuffled, setIsShuffled] = useState(false);
  const [repeatMode, setRepeatMode] = useState<"off" | "one" | "all">("off");

  // Original queue (untuk shuffle/unshuffle)
  const [originalQueue, setOriginalQueue] = useState<Song[]>([]);

  // Refs
  const playerRef = useRef<any>(null);
  const progressIntervalRef = useRef<number | null>(null);
  const [isPlayerReady, setIsPlayerReady] = useState(false);
  const pendingAutoPlayRef = useRef(false);
  const handleAutoNextRef = useRef<() => void>(() => {});
  const searchedSongsRef = useRef<Set<string>>(new Set()); // Track searched songs
  const createYouTubePlayerRef = useRef<(song: Song) => boolean>(() => false); // Ref untuk avoid circular deps
  const currentRecommendationsRef = useRef<string>(""); // Track current song for recommendations

  // Start progress tracking
  const startProgressTracking = useCallback(() => {
    if (progressIntervalRef.current) {
      clearInterval(progressIntervalRef.current);
    }

    progressIntervalRef.current = setInterval(() => {
      if (playerRef.current && isPlaying && isPlayerReady) {
        try {
          const currentTime = playerRef.current.getCurrentTime();
          const duration = playerRef.current.getDuration();

          setCurrentTime(currentTime);
          if (duration > 0) {
            const newProgress = (currentTime / duration) * 100;
            setProgress(newProgress);
          }
        } catch (error) {
          console.error("Error updating progress:", error);
        }
      }
    }, 1000);
  }, [isPlaying, isPlayerReady]);

  // Stop progress tracking
  const stopProgressTracking = useCallback(() => {
    if (progressIntervalRef.current) {
      clearInterval(progressIntervalRef.current);
      progressIntervalRef.current = null;
    }
  }, []);

  // ========== YOUTUBE PLAYER FUNCTIONS ==========
  const createYouTubePlayer = useCallback(
    (song: Song) => {
      if (!song.youtube_id) {
        console.error("No YouTube ID");
        return false;
      }

      // ⭐ AGGRESSIVE CLEANUP - Stop dan destroy player lama dulu
      console.log(`Destroying old player for new song: ${song.title}`);
      if (playerRef.current) {
        try {
          // Stop playback immediately
          playerRef.current.stopVideo?.();
          playerRef.current.pauseVideo?.();
        } catch (e) {
          console.warn("Error stopping old player:", e);
        }

        try {
          // Properly destroy
          playerRef.current.destroy?.();
        } catch (e) {
          console.warn("Error destroying old player:", e);
        }

        playerRef.current = null;
      }

      // Reset state
      setIsPlayerReady(false);
      setProgress(0);
      setCurrentTime(0);
      setPlaybackError(null);

      // Buat player baru
      // Pastikan YouTube IFrame API sudah siap
      if (!(window as any).YT || !(window as any).YT.Player) {
        console.warn("YouTube API not ready yet");
        setPlaybackError("Player is loading, please try again in a moment.");
        return false;
      }

      console.log(
        `Creating new YouTube player for: ${song.title} (ID: ${song.youtube_id})`,
      );

      playerRef.current = new (window as any).YT.Player("youtube-player", {
        height: "0",
        width: "0",
        videoId: song.youtube_id,
        playerVars: {
          autoplay: 0,
          controls: 0,
          disablekb: 1,
          fs: 0,
          modestbranding: 1,
          rel: 0,
          showinfo: 0,
          iv_load_policy: 3,
          playsinline: 1,
          quality: "small",
          enablejsapi: 1,
        },
        events: {
          onReady: (event: any) => {
            console.log(
              "YouTube Player Ready for:",
              event.target?.getVideoData?.()?.title || "unknown",
            );
            setIsPlayerReady(true);
            event.target.setVolume(volume);
            const duration = event.target.getDuration();
            setDuration(duration);

            // ⭐ Auto-play langsung jika user request
            if (pendingAutoPlayRef.current) {
              console.log("Auto-playing from onReady...");
              pendingAutoPlayRef.current = false;

              try {
                event.target.playVideo();
                setIsPlaying(true);
                startProgressTracking();
              } catch (e) {
                console.error("Error playing video:", e);
              }
              return;
            }
          },
          onStateChange: (event: any) => {
            const state = event.data;
            console.log("YouTube state changed:", state);

            if (state === 1) {
              // Playing
              setIsPlaying(true);
              startProgressTracking();
            } else if (state === 2) {
              // Paused
              setIsPlaying(false);
              stopProgressTracking();
            } else if (state === 0) {
              // Ended
              console.log("Song ended, auto next...");
              setIsPlaying(false);
              setProgress(100);
              handleAutoNextRef.current();
            }
          },
          onError: (error: any) => {
            console.error("YouTube Player Error:", error);
            console.error("Error code:", error.data);

            // ⭐ Handle common YouTube errors
            const errorMessages: Record<number, string> = {
              2: "Invalid video ID",
              5: "HTML5 player error - video format not supported",
              100: "Video not found or has been removed",
              101: "Video owner has restricted playback on this website",
              150: "Video owner has restricted playback on this website",
            };

            const errorMsg =
              errorMessages[error.data] || "Unable to play this song";
            setPlaybackError(errorMsg);

            // ⭐ Try to fetch YouTube ID dari backend untuk video yang tidak ditemukan
            if (
              song &&
              (error.data === 2 ||
                error.data === 100 ||
                error.data === 101 ||
                error.data === 150)
            ) {
              if (!searchedSongsRef.current.has(song.id)) {
                console.warn(
                  "Video not found or cannot be embedded. Fetching from backend...",
                );
                setPlaybackError("Fetching song source...");

                // Mark sebagai sudah di-search
                searchedSongsRef.current.add(song.id);

                // Fetch YouTube ID dari backend
                songResourceApiYoutube({ id: song.id })
                  .then((result) => {
                    // ⭐ Check jika ada video_id yang valid
                    if (result.data?.video_id && result.data.video_id.trim()) {
                      console.log(
                        `Found YouTube ID: ${result.data.video_id} for "${song.title}"`,
                      );

                      // Update current song dengan YouTube ID dari backend
                      const updatedSong = {
                        ...song,
                        youtube_id: result.data.video_id,
                      };
                      setCurrentSong(updatedSong);

                      // Set auto-play flag dan buat player baru via ref
                      pendingAutoPlayRef.current = true;
                      createYouTubePlayerRef.current(updatedSong);
                    } else {
                      // ⭐ No video_id found (status: not_found atau empty)
                      console.warn(
                        `No YouTube ID available for "${song.title}" - skipping...`,
                      );
                      setPlaybackError(
                        `Cannot play "${song.title}" - no source - skipping...`,
                      );

                      // Skip ke lagu berikutnya immediately
                      setTimeout(() => {
                        handleAutoNextRef.current();
                      }, 1500);
                    }
                  })
                  .catch((err: any) => {
                    // ⭐ Fetch error (network, server error, etc)
                    console.error("Error fetching YouTube ID:", err);
                    
                    // Check if 404 specifically
                    if (err.response?.status === 404) {
                      setPlaybackError(
                        `"${song.title}" not available - skipping...`,
                      );
                    } else {
                      setPlaybackError(
                        "Error fetching song source - skipping...",
                      );
                    }

                    // Skip ke lagu berikutnya
                    setTimeout(() => {
                      handleAutoNextRef.current();
                    }, 1500);
                  });

              } else {
                // Already tried, just skip
                console.log(
                  `Already tried fetching YouTube ID for "${song.title}", skipping...`,
                );
                setTimeout(() => {
                  handleAutoNextRef.current();
                }, 2000);
              }
            }
          },
        },
      });

      return true;
    },
    [volume, startProgressTracking],
  );

  // Update ref dengan latest createYouTubePlayer untuk dihindari circular deps
  useEffect(() => {
    createYouTubePlayerRef.current = createYouTubePlayer;
  }, [createYouTubePlayer]);

  // ========== PLAYLIST & QUEUE FUNCTIONS ==========
  const getNextIndex = useCallback((): number => {
    if (queue.length === 0) return -1;

    if (repeatMode === "one") {
      return currentIndex; // Play same song again
    }

    const nextIndex = currentIndex + 1;

    if (nextIndex >= queue.length) {
      if (repeatMode === "all") {
        return 0; // Back to start
      }
      return -1; // Stop playing
    }

    return nextIndex;
  }, [currentIndex, queue.length, repeatMode]);

  const getPrevIndex = useCallback((): number => {
    if (queue.length === 0) return -1;

    const prevIndex = currentIndex - 1;

    if (prevIndex < 0) {
      if (repeatMode === "all") {
        return queue.length - 1; // Go to last song
      }
      return -1; // Stop playing
    }

    return prevIndex;
  }, [currentIndex, queue.length, repeatMode]);

  // Play song at index
  const playAtIndex = useCallback(
    (index: number) => {
      if (index < 0 || index >= queue.length) {
        console.log("No more songs in queue");
        setIsPlaying(false);
        return;
      }

      const song = queue[index];
      setCurrentIndex(index);
      setCurrentSong(song);

      console.log(`Playing song ${index + 1}/${queue.length}:`, song.title);

      if (song.youtube_id) {
        // Set auto-play flag for seamless transition
        pendingAutoPlayRef.current = true;
        createYouTubePlayer(song);
      } else {
        console.warn("No YouTube ID for song");
        // Fallback logic bisa ditambahkan di sini
      }
    },
    [queue, createYouTubePlayer],
  );

  // Auto play next song (disimpan di ref agar tidak bikin circular dependency)
  useEffect(() => {
    handleAutoNextRef.current = () => {
      const nextIndex = getNextIndex();
      if (nextIndex !== -1) {
        playAtIndex(nextIndex);
      } else {
        console.log("End of queue");
        setIsPlaying(false);
      }
    };
  }, [getNextIndex, playAtIndex]);

  // Play single song + fetch recommendations
  const play = useCallback(
    (song: Song) => {
      console.log("🎵 Play song requested:", song.title);

      // ⭐ STOP PLAYBACK IMMEDIATELY
      if (playerRef.current) {
        try {
          playerRef.current.stopVideo?.();
          playerRef.current.pauseVideo?.();
        } catch (e) {
          console.warn("Error stopping current playback:", e);
        }
      }

      // ⭐ Reset all state
      setIsPlaying(false);
      stopProgressTracking();
      setProgress(0);
      setCurrentTime(0);

      // Tandai bahwa ini aksi langsung dari user
      pendingAutoPlayRef.current = true;

      // ⭐ RESET QUEUE dan Play single song
      setQueue([song]);
      setCurrentIndex(0);
      setCurrentSong(song);

      console.log("Creating player for song with ID:", song.youtube_id);

      if (song.youtube_id) {
        // Small delay untuk ensure proper cleanup sebelum create player baru
        setTimeout(() => {
          createYouTubePlayer(song);
        }, 50);
      }

      // ⭐ FETCH RECOMMENDATIONS ASYNCHRONOUSLY
      if (song.id !== currentRecommendationsRef.current) {
        currentRecommendationsRef.current = song.id;

        console.log(
          `Fetching content-based recommendations for "${song.title}"...`,
        );

        recommendationContentApi({ song_id: song.id })
          .then((response) => {
            const recommendations = response.data?.recommendations ?? [];

            if (recommendations.length > 0) {
              console.log(
                `Loaded ${recommendations.length} recommendations for "${song.title}"`,
              );

              // Extract songs dari recommendations
              const recommendedSongs = recommendations.map((rec) => rec.song);

              // Add to queue (append ke queue yang sekarang sudah punya 1 song)
              setQueue((prevQueue) => {
                // Hanya tambah jika masih song yang sama yang sedang di-play
                if (prevQueue[0]?.id === song.id) {
                  return [prevQueue[0], ...recommendedSongs];
                }
                return prevQueue;
              });
            }
          })
          .catch((err) => {
            console.warn("Failed to fetch recommendations:", err);
            // Continue playing without recommendations
          });
      }
    },
    [createYouTubePlayer, stopProgressTracking],
  );

  // Pause
  const pause = useCallback(() => {
    if (playerRef.current && isPlayerReady) {
      playerRef.current.pauseVideo();
    }
    setIsPlaying(false);
    stopProgressTracking();
  }, [isPlayerReady, stopProgressTracking]);

  // Toggle play/pause
  const togglePlay = useCallback(() => {
    if (!currentSong) return;

    if (isPlaying) {
      pause();
    } else {
      if (playerRef.current && isPlayerReady) {
        playerRef.current.playVideo();
        setIsPlaying(true);
        startProgressTracking();
      } else if (currentSong.youtube_id) {
        // Jika player belum ready, buat ulang dan tandai bahwa user minta auto-play
        pendingAutoPlayRef.current = true;
        createYouTubePlayer(currentSong);
      }
    }
  }, [
    currentSong,
    isPlaying,
    pause,
    isPlayerReady,
    startProgressTracking,
    createYouTubePlayer,
  ]);

  // Set progress (seek)
  const setProgressHandler = useCallback(
    (newProgress: number) => {
      if (playerRef.current && isPlayerReady && duration > 0) {
        const seconds = (newProgress / 100) * duration;
        playerRef.current.seekTo(seconds, true);
        setCurrentTime(seconds);
        setProgress(newProgress);
      }
    },
    [isPlayerReady, duration],
  );

  // Set volume
  const setVolume = useCallback(
    (newVolume: number) => {
      if (playerRef.current && isPlayerReady) {
        playerRef.current.setVolume(newVolume);
      }
      setVolumeState(newVolume);
    },
    [isPlayerReady],
  );

  // Seek to specific time
  const seekTo = useCallback(
    (seconds: number) => {
      if (playerRef.current && isPlayerReady) {
        playerRef.current.seekTo(seconds, true);
        setCurrentTime(seconds);
        if (duration > 0) {
          setProgress((seconds / duration) * 100);
        }
      }
    },
    [isPlayerReady, duration],
  );

  // Next song
  const nextSong = useCallback(() => {
    console.log("Next song requested");

    const nextIndex = getNextIndex();
    console.log("Next index:", nextIndex);

    if (nextIndex !== -1) {
      playAtIndex(nextIndex);
    } else {
      // End of queue
      console.log("End of queue");
      setIsPlaying(false);
      setCurrentSong(null);
      setCurrentIndex(-1);

      if (playerRef.current) {
        playerRef.current.stopVideo();
      }
    }
  }, [getNextIndex, playAtIndex]);

  // Previous song
  const prevSong = useCallback(() => {
    console.log("Previous song requested");

    const prevIndex = getPrevIndex();
    console.log("Previous index:", prevIndex);

    if (prevIndex !== -1) {
      playAtIndex(prevIndex);
    } else {
      // Start of queue
      console.log("Start of queue");
      playAtIndex(0);
    }
  }, [getPrevIndex, playAtIndex]);

  // Clear player
  const clearPlayer = useCallback(() => {
    if (playerRef.current) {
      playerRef.current.destroy();
      playerRef.current = null;
    }
    setCurrentSong(null);
    setIsPlaying(false);
    setIsPlayerReady(false);
    setProgress(0);
    setCurrentTime(0);
    setDuration(0);
    stopProgressTracking();
  }, [stopProgressTracking]);

  // ========== QUEUE MANAGEMENT ==========
  const addToQueue = useCallback((song: Song) => {
    setQueue((prev) => [...prev, song]);
    console.log(`Added "${song.title}" to queue`);
  }, []);

  const addMultipleToQueue = useCallback((songs: Song[]) => {
    setQueue((prev) => [...prev, ...songs]);
    console.log(`Added ${songs.length} songs to queue`);
  }, []);

  const playNext = useCallback(
    (song: Song) => {
      setQueue((prev) => {
        const newQueue = [...prev];
        const insertIndex = currentIndex + 1;
        newQueue.splice(insertIndex, 0, song);
        return newQueue;
      });
      console.log(`"${song.title}" will play next`);
    },
    [currentIndex],
  );

  const removeFromQueue = useCallback(
    (index: number) => {
      setQueue((prev) => {
        const newQueue = [...prev];
        newQueue.splice(index, 1);

        // Adjust current index jika perlu
        if (currentIndex > index) {
          setCurrentIndex((prevIndex) => prevIndex - 1);
        } else if (currentIndex === index) {
          // Jika current song dihapus, play next
          if (newQueue.length > 0) {
            const nextIdx = index < newQueue.length ? index : 0;
            setTimeout(() => playAtIndex(nextIdx), 100);
          } else {
            setCurrentSong(null);
            setCurrentIndex(-1);
            setIsPlaying(false);
          }
        }

        return newQueue;
      });
    },
    [currentIndex, playAtIndex],
  );

  const clearQueue = useCallback(() => {
    setQueue([]);
    setCurrentIndex(-1);
    setCurrentSong(null);
    setIsPlaying(false);
    console.log("Queue cleared");
  }, []);

  const shuffleQueue = useCallback(() => {
    if (isShuffled) {
      // Unshuffle - kembali ke original order
      setQueue(originalQueue);
      const originalIndex = originalQueue.findIndex(
        (s) => s.id === currentSong?.id,
      );
      if (originalIndex !== -1) {
        setCurrentIndex(originalIndex);
      }
      setIsShuffled(false);
      console.log("Queue unshuffled");
    } else {
      // Shuffle - simpan original dan acak
      setOriginalQueue(queue);

      const shuffled = [...queue];
      for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
      }

      setQueue(shuffled);

      // Update current index di shuffled array
      const shuffledIndex = shuffled.findIndex((s) => s.id === currentSong?.id);
      if (shuffledIndex !== -1) {
        setCurrentIndex(shuffledIndex);
      }

      setIsShuffled(true);
      console.log("Queue shuffled");
    }
  }, [queue, originalQueue, currentSong, isShuffled]);

  const setRepeatModeHandler = useCallback((mode: "off" | "one" | "all") => {
    setRepeatMode(mode);
    console.log(`Repeat mode set to: ${mode}`);
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopProgressTracking();
      if (playerRef.current) {
        playerRef.current.destroy();
      }
    };
  }, [stopProgressTracking]);

  // Initialize YouTube API
  useEffect(() => {
    if (!window.YT) {
      const tag = document.createElement("script");
      tag.src = "https://www.youtube.com/iframe_api";
      const firstScriptTag = document.getElementsByTagName("script")[0];
      firstScriptTag.parentNode?.insertBefore(tag, firstScriptTag);
    }

    (window as any).onYouTubeIframeAPIReady = () => {
      console.log("YouTube API Ready");
    };
  }, []);

  const value = useMemo(
    () => ({
      // State
      currentSong,
      isPlaying,
      progress,
      volume,
      currentTime,
      duration,
      playbackError, // ⭐ Add to context

      // Playlist
      queue,
      currentIndex,
      isShuffled,
      repeatMode,

      // Actions
      play,
      playSong: play,
      pause,
      togglePlay,
      setProgress: setProgressHandler,
      setVolume,
      seekTo,
      nextSong,
      prevSong,
      clearPlayer,

      // Playlist actions
      addToQueue,
      addMultipleToQueue,
      removeFromQueue,
      clearQueue,
      shuffleQueue,
      setRepeatMode: setRepeatModeHandler,
      playNext,
    }),
    [
      currentSong,
      isPlaying,
      progress,
      volume,
      currentTime,
      duration,
      playbackError, // ⭐ Add to dependencies
      queue,
      currentIndex,
      isShuffled,
      repeatMode,
      play,
      pause,
      togglePlay,
      setProgressHandler,
      setVolume,
      seekTo,
      nextSong,
      prevSong,
      clearPlayer,
      addToQueue,
      addMultipleToQueue,
      removeFromQueue,
      clearQueue,
      shuffleQueue,
      setRepeatModeHandler,
      playNext,
    ],
  );

  return (
    <PlayerContext.Provider value={value}>
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
    </PlayerContext.Provider>
  );
};
