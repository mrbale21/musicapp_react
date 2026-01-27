// utils/alertHelpers.ts
import { useAlert } from "../context/AlertContext";

// Custom hooks untuk alert yang spesifik
export const useMusicAlert = () => {
  const { showAlert } = useAlert();

  return {
    successLike: () => {
      const messages = [
        "Added to your Liked Songs! 🎵",
        "Song liked! ❤️",
        "Added to favorites! ⭐",
        "You'll love this track! 🎶",
      ];
      const message = messages[Math.floor(Math.random() * messages.length)];
      showAlert("success", "Song Liked", message, 3000);
    },

    successUnlike: () => {
      const messages = [
        "Removed from liked songs",
        "Song unliked",
        "Removed from favorites",
      ];
      showAlert("success", "Song Unliked", messages[0], 3000);
    },

    errorLike: () => {
      showAlert("error", "Error", "Failed to update like status", 4000);
    },

    errorPlay: () => {
      showAlert("error", "Error", "Failed to play song", 4000);
    },

    addedToPlaylist: (playlistName: string) => {
      showAlert(
        "success",
        "Added to Playlist",
        `Added to "${playlistName}"`,
        3500
      );
    },

    playingNow: (songTitle: string, artist: string) => {
      showAlert("info", "Now Playing", `${songTitle} • ${artist}`, 3000);
    },

    queueAdded: (songTitle: string) => {
      showAlert(
        "success",
        "Added to Queue",
        `"${songTitle}" added to queue`,
        3000
      );
    },

    playlistCreated: (name: string) => {
      showAlert(
        "success",
        "Playlist Created",
        `"${name}" created successfully`,
        3500
      );
    },

    downloadStarted: (songTitle: string) => {
      showAlert(
        "info",
        "Download Started",
        `Downloading "${songTitle}"...`,
        3000
      );
    },

    downloadComplete: (songTitle: string) => {
      showAlert(
        "success",
        "Download Complete",
        `"${songTitle}" downloaded successfully`,
        3500
      );
    },
  };
};

// Function untuk alert umum
export const alert = {
  success: (title: string, message: string, duration?: number) => {
    const { showAlert } = useAlert();
    showAlert("success", title, message, duration);
  },

  error: (title: string, message: string, duration?: number) => {
    const { showAlert } = useAlert();
    showAlert("error", title, message, duration);
  },

  info: (title: string, message: string, duration?: number) => {
    const { showAlert } = useAlert();
    showAlert("info", title, message, duration);
  },

  warning: (title: string, message: string, duration?: number) => {
    const { showAlert } = useAlert();
    showAlert("warning", title, message, duration);
  },
};
