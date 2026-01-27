// hooks/useSongsInteractions.ts (VERSI SIMPLE)
import { useState, useRef } from "react";
import useApi from "../apis/api";
import {
  songLikeApi,
  songStorePlayApi,
  songUnLikeApi,
} from "../apis/endpoints/songlike";
import { useMusicAlert } from "../utils/alerthelpers";
import type { Song } from "../apis/models/models";

interface UseSongInteractionsProps {
  onUpdateSong?: (songId: string, updates: Partial<Song>) => void;
}

export const useSongInteractions = ({
  onUpdateSong,
}: UseSongInteractionsProps = {}) => {
  const [likeLoading, setLikeLoading] = useState<string | null>(null);
  const [playLoading, setPlayLoading] = useState<string | null>(null);

  // Untuk tracking debounce
  const likeTimers = useRef<Record<string, any>>({});
  const musicAlert = useMusicAlert();

  const likeApi = useApi({ api: songLikeApi });
  const unlikeApi = useApi({ api: songUnLikeApi });
  const playApi = useApi({ api: songStorePlayApi });

  // Clear timer helper
  const clearLikeTimer = (songId: string) => {
    if (likeTimers.current[songId]) {
      clearTimeout(likeTimers.current[songId]);
      delete likeTimers.current[songId];
    }
  };

  /* =======================
   * ❤️ LIKE / UNLIKE dengan ANIMASI SMOOTH
   * ======================= */
  const handleLike = async (song: Song) => {
    const songId = song.id;

    // Clear timer sebelumnya
    clearLikeTimer(songId);

    // Jika sedang loading, skip
    if (likeLoading === songId) return;

    // Optimistic update: langsung ubah UI
    const previousLikeState = song.is_liked;
    const newLikeState = !previousLikeState;

    // Update UI sekarang juga
    onUpdateSong?.(songId, { is_liked: newLikeState });

    // Set loading state
    setLikeLoading(songId);

    try {
      // Delay sedikit untuk memberikan feedback visual
      await new Promise((resolve) => setTimeout(resolve, 200));

      if (previousLikeState) {
        await unlikeApi.process({ song_id: songId });
        musicAlert.successUnlike();
      } else {
        await likeApi.process({ song_id: songId });
        musicAlert.successLike();
      }

      return { success: true, liked: newLikeState };
    } catch (error) {
      console.error("Error in like interaction:", error);

      // Rollback jika error
      onUpdateSong?.(songId, { is_liked: previousLikeState });
      musicAlert.errorLike();

      return { success: false, liked: previousLikeState };
    } finally {
      // Clear loading dengan delay untuk smooth animation
      setTimeout(() => {
        setLikeLoading((prev) => (prev === songId ? null : prev));
      }, 400);
    }
  };

  /* =======================
   * ▶️ PLAY SONG
   * ======================= */
  const handlePlay = async (song: Song) => {
    const songId = song.id;

    if (playLoading === songId) return;

    setPlayLoading(songId);
    try {
      await playApi.process({ song_id: songId });
      musicAlert.playingNow(song.title, song.artist);
      return { success: true };
    } catch (error) {
      console.error("Error in play interaction:", error);
      musicAlert.errorLike();
      return { success: false };
    } finally {
      setTimeout(() => {
        setPlayLoading((prev) => (prev === songId ? null : prev));
      }, 400);
    }
  };

  /* =======================
   * ▶️ PLAY + NAVIGATE
   * ======================= */
  const handlePlayAndNavigate = async (song: Song) => {
    const result = await handlePlay(song);
    return { success: result?.success || false, song };
  };

  /* =======================
   * CLEANUP
   * ======================= */
  const cleanup = () => {
    Object.keys(likeTimers.current).forEach(clearLikeTimer);
  };

  /* =======================
   * RETURN API
   * ======================= */
  return {
    handleLike,
    handlePlay,
    handlePlayAndNavigate,
    cleanup,

    // loading state
    likeLoading,
    playLoading,

    // helper
    isLikeLoading: (songId: string) => likeLoading === songId,
    isPlayLoading: (songId: string) => playLoading === songId,
  };
};
