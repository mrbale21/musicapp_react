// pages/PopularSongsPage.tsx
import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import useApi from "../apis/api";
import Header from "../components/Header";
import {
  TrendingUp,
  ChevronLeft,
  ChevronRight,
  Music,
  Play,
  Heart,
} from "lucide-react";
import LoadingSpinner from "../components/common/LoadingSpinner";
import type { Song } from "../apis/models/models";
import { recommendationPopularApi } from "../apis/endpoints/recommendation";
import { useMusicPlayer } from "../hooks/useMusicPlayer";
import { useSongInteractions } from "../hooks/useSongsInteractions";
import { usePlayer } from "../context/PlayerContext";

const ITEMS_PER_PAGE = 20;

const PopularSongsPage = () => {
  const navigate = useNavigate();
  const player = usePlayer();

  // State
  const [songs, setSongs] = useState<Song[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalSongs, setTotalSongs] = useState(0);

  // API
  const popularSongsApi = useApi({
    api: recommendationPopularApi,
    onSuccess: (data) => {
      if (data?.data?.songs) {
        setSongs(data.data.songs);
        setTotalSongs(data.data.songs.length);
      }
      setLoading(false);
    },
    onFail: (error) => {
      console.error("Error fetching popular songs:", error);
      toast.error("Gagal memuat lagu populer");
      setLoading(false);
    },
  });

  // Custom Hooks
  const { play, isCurrentPlaying } = useMusicPlayer();
  const { handleLike, handlePlay, isLikeLoading, isPlayLoading } =
    useSongInteractions({
      onUpdateSong: (songId, updates) => {
        setSongs((prev) =>
          prev.map((song) =>
            song.id === songId ? { ...song, ...updates } : song,
          ),
        );
      },
    });

  // Fetch data on mount
  useEffect(() => {
    popularSongsApi.process({});
  }, []);

  // Calculate pagination
  const totalPages = Math.ceil(totalSongs / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const currentSongs = songs.slice(startIndex, endIndex);

  // Handlers
  const handlePlaySong = useCallback(
    async (song: Song, e?: React.MouseEvent) => {
      if (e) e.stopPropagation();

      try {
        if (song.youtube_id) {
          play(song);
          await handlePlay(song);
          toast.success(`Memutar "${song.title}"`);
        } else {
          toast.info("Mencari sumber audio...");
        }
      } catch (error) {
        console.error("Play error:", error);
        toast.error("Gagal memutar lagu");
      }
    },
    [play, handlePlay],
  );

  const handleLikeSong = useCallback(
    async (song: Song, e?: React.MouseEvent) => {
      if (e) e.stopPropagation();

      try {
        await handleLike(song);
        toast.success(
          song.is_liked
            ? `Disukai "${song.title}"`
            : `Tidak disukai "${song.title}"`,
        );
      } catch (error) {
        console.error("Like error:", error);
        toast.error("Gagal menyukai lagu");
      }
    },
    [handleLike],
  );

  const handleAddAllToQueue = useCallback(() => {
    const songsWithYouTube = songs.filter((song) => song.youtube_id);

    if (songsWithYouTube.length === 0) {
      toast.warning("Tidak ada lagu dengan sumber YouTube tersedia");
      return;
    }

    player.addMultipleToQueue(songsWithYouTube);
    toast.success(`Menambahkan ${songsWithYouTube.length} lagu ke antrian!`);
  }, [songs, player]);

  const handlePlayAll = useCallback(() => {
    const songsWithYouTube = songs
      .filter((song) => song.youtube_id)
      .slice(0, 20);

    if (songsWithYouTube.length === 0) {
      toast.warning("Tidak ada lagu dengan sumber YouTube tersedia");
      return;
    }

    player.clearQueue();
    player.addMultipleToQueue(songsWithYouTube);

    if (songsWithYouTube[0]) {
      play(songsWithYouTube[0]);
    }

    toast.success(`Memutar ${songsWithYouTube.length} lagu populer!`);
  }, [songs, player, play]);

  const handlePageChange = useCallback((page: number) => {
    setCurrentPage(page);
    // Scroll to top
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-gray-900 to-black">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black">
      <Header title="Lagu Populer" showBack onBack={() => navigate(-1)} />

      <div className="p-4">
        {/* Stats and Actions */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-6 h-6 text-purple-400" />
              <div>
                <h1 className="text-2xl font-bold text-white">Lagu Populer</h1>
                <p className="text-sm text-gray-400">
                  {totalSongs} lagu • Halaman {currentPage} dari {totalPages}
                </p>
              </div>
            </div>
          </div>

          <div className="flex gap-2 mb-6">
            <button
              onClick={handlePlayAll}
              className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white font-medium py-3 rounded-xl transition-all duration-200 flex items-center justify-center gap-2"
            >
              <Play className="w-5 h-5" />
              <span>Putar Semua</span>
            </button>
            <button
              onClick={handleAddAllToQueue}
              className="flex-1 bg-gray-800 hover:bg-gray-700 text-white font-medium py-3 rounded-xl transition-all duration-200 flex items-center justify-center gap-2"
            >
              <Music className="w-5 h-5" />
              <span>Tambahkan ke Antrian</span>
            </button>
          </div>
        </div>

        {/* Songs List */}
        <div className="space-y-3">
          {currentSongs.length === 0 ? (
            <div className="text-center py-12">
              <Music className="w-16 h-16 text-gray-600 mx-auto mb-4" />
              <p className="text-gray-400 text-lg">Tidak ada lagu tersedia</p>
            </div>
          ) : (
            currentSongs.map((song, index) => (
              <div
                key={song.id}
                onClick={() => navigate(`/song/${song.id}`)}
                className="flex items-center gap-4 p-4 bg-gray-900/50 backdrop-blur-sm rounded-xl border border-gray-800 hover:bg-gray-800/50 cursor-pointer transition-all duration-200 group"
              >
                {/* Song Number */}
                <div className="flex-shrink-0 w-8 text-center">
                  <span className="text-sm text-gray-500 font-medium">
                    {startIndex + index + 1}
                  </span>
                </div>

                {/* Thumbnail */}
                <div className="relative flex-shrink-0">
                  <div className="relative group/thumbnail">
                    <div
                      className={`
                        w-14 h-14 rounded-lg overflow-hidden transition-all duration-300
                        ${isCurrentPlaying(song.id) ? "ring-2 ring-purple-500 scale-105 shadow-lg shadow-purple-500/20" : ""}
                      `}
                    >
                      <img
                        src={song.image_url || "/placeholder-album.jpg"}
                        alt={song.title}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover/thumbnail:scale-110"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.src = "/placeholder-album.jpg";
                        }}
                      />
                    </div>
                    <button
                      onClick={(e) => handlePlaySong(song, e)}
                      disabled={isPlayLoading(song.id)}
                      className="absolute inset-0 bg-black/70 rounded-lg flex items-center justify-center opacity-0 group-hover/thumbnail:opacity-100 transition-all duration-300"
                    >
                      {isPlayLoading(song.id) ? (
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      ) : (
                        <Play className="w-6 h-6 text-white" fill="white" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Song Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <h3 className="text-sm font-medium text-white truncate group-hover:text-purple-300 transition-colors">
                        {song.title}
                      </h3>
                      <p className="text-xs text-gray-400 truncate">
                        {song.artist || "Unknown Artist"}
                      </p>
                    </div>
                    <div className="ml-2 flex items-center gap-4">
                      {song.album && (
                        <span className="text-xs text-gray-500 hidden sm:block">
                          {song.album}
                        </span>
                      )}
                      {song.tempo && (
                        <span className="text-xs text-gray-500">
                          {Math.floor(song.tempo / 60)}:
                          {String(song.tempo % 60).padStart(2, "0")}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-2 mt-2">
                    {song.genre && (
                      <span className="text-xs px-2 py-1 bg-gray-800/70 rounded">
                        {song.genre}
                      </span>
                    )}
                    {song.popularity && (
                      <span className="text-xs text-gray-500">
                        {song.popularity.toLocaleString()}% popular
                      </span>
                    )}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2">
                  <button
                    onClick={(e) => handleLikeSong(song, e)}
                    disabled={isLikeLoading(song.id)}
                    className={`p-2 rounded-lg transition-all duration-200 ${
                      song.is_liked
                        ? "bg-pink-500/20 text-pink-500 hover:bg-pink-500/30"
                        : "hover:bg-gray-800 text-gray-400"
                    }`}
                  >
                    {isLikeLoading(song.id) ? (
                      <div className="w-4 h-4 border-2 border-current/30 border-t-current rounded-full animate-spin"></div>
                    ) : (
                      <Heart
                        className={`w-5 h-5 ${song.is_liked ? "fill-current" : ""}`}
                      />
                    )}
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="mt-8 flex items-center justify-center gap-2">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="p-2 rounded-lg bg-gray-800 hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronLeft className="w-5 h-5 text-white" />
            </button>

            <div className="flex items-center gap-1">
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                let pageNum;
                if (totalPages <= 5) {
                  pageNum = i + 1;
                } else if (currentPage <= 3) {
                  pageNum = i + 1;
                } else if (currentPage >= totalPages - 2) {
                  pageNum = totalPages - 4 + i;
                } else {
                  pageNum = currentPage - 2 + i;
                }

                return (
                  <button
                    key={pageNum}
                    onClick={() => handlePageChange(pageNum)}
                    className={`w-10 h-10 rounded-lg font-medium transition-all duration-200 ${
                      currentPage === pageNum
                        ? "bg-gradient-to-r from-purple-600 to-pink-600 text-white"
                        : "bg-gray-800 hover:bg-gray-700 text-gray-300"
                    }`}
                  >
                    {pageNum}
                  </button>
                );
              })}
            </div>

            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="p-2 rounded-lg bg-gray-800 hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronRight className="w-5 h-5 text-white" />
            </button>
          </div>
        )}

        {/* Footer Info */}
        <div className="mt-8 text-center text-sm text-gray-500">
          <p>
            Menampilkan {currentSongs.length} dari {totalSongs} lagu populer
          </p>
        </div>
      </div>
    </div>
  );
};

export default PopularSongsPage;
