// hooks/useMusicPlayer.ts - Update sesuai interface baru
import { usePlayer } from "../context/PlayerContext";
import type { Song } from "../apis/models/models";

export const useMusicPlayer = () => {
  const player = usePlayer();

  const play = (song: Song) => {
    player.play(song);
  };

  const isCurrentPlaying = (songId: string) => {
    return player.currentSong?.id === songId && player.isPlaying;
  };

  return {
    play,
    pause: player.pause,
    togglePlay: player.togglePlay,
    isCurrentPlaying,
    currentSong: player.currentSong,
    isPlaying: player.isPlaying,
    progress: player.progress,
    // Optional: tambah jika perlu
    nextSong: player.nextSong,
    prevSong: player.prevSong,
    playNext: player.playNext,
    queue: player.queue,
    currentIndex: player.currentIndex,
  };
};
