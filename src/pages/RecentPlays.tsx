import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import useApi from "../apis/api";
import {
  History,
  ChevronLeft,
  ChevronRight,
  Music,
  Play,
  Heart,
  Clock,
  RefreshCw,
} from "lucide-react";
import LoadingSpinner from "../components/common/LoadingSpinner";
import type { Song } from "../apis/models/models";
import { useMusicPlayer } from "../hooks/useMusicPlayer";
import { useSongInteractions } from "../hooks/useSongsInteractions";
import { usePlayer } from "../context/PlayerContext";
import { songUsePlaysApi } from "../apis/endpoints/songlike";

const ITEMS_PER_PAGE = 15;

const RecentSongPage = () => {
  const navigate = useNavigate();
  const player = usePlayer();

  // State
  const [songs, setSongs] = useState<Song[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalSongs, setTotalSongs] = useState(0);
  const [refreshing, setRefreshing] = useState(false);

  // API
  const playsSongsApi = useApi({
    api: songUsePlaysApi,
    onSuccess: (data) => {
      if (data?.data && Array.isArray(data.data)) {
        const mappedSongs: Song[] = data.data.map((s: any) => ({
          ...s,
          is_liked: s.is_liked === "1" || s.is_liked === true,
        }));

        setSongs(mappedSongs);
        setTotalSongs(mappedSongs.length);
      } else {
        console.warn("Invalid data structure for plays:", data);
        setSongs([]);
        setTotalSongs(0);
      }
      setLoading(false);
    },
    onFail: (error) => {
      console.error("Error fetching recent songs:", error);
      toast.error("Gagal memuat riwayat pemutaran");
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
    playsSongsApi.process({});
  }, []);

  // Refresh function
  const handleRefresh = useCallback(() => {
    if (refreshing) return;
    setRefreshing(true);
    playsSongsApi.process({});
    setTimeout(() => setRefreshing(false), 1000); // Reset refreshing state
  }, [refreshing, playsSongsApi]);

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

    toast.success(`Memutar ${songsWithYouTube.length} lagu dari riwayat!`);
  }, [songs, player, play]);

  const handlePageChange = useCallback((page: number) => {
    setCurrentPage(page);
    // Scroll to top
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-linear-to-br from-gray-900 via-blue-900/20 to-black flex items-center justify-center relative overflow-hidden">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-20 -right-20 w-60 h-60 bg-blue-600/30 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute -bottom-20 -left-20 w-60 h-60 bg-teal-600/30 rounded-full blur-3xl animate-pulse delay-700"></div>
        </div>
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-gray-900 via-blue-900/20 to-black pb-32 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-20 -right-20 w-60 h-60 bg-blue-600/30 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-20 -left-20 w-60 h-60 bg-teal-600/30 rounded-full blur-3xl animate-pulse delay-700"></div>
      </div>

      {/* Animated Particles */}
      <div className="absolute inset-0">
        {[...Array(5)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-teal-500/30 rounded-full"
            style={{
              left: `${10 + i * 18}%`,
              top: `${12 + i * 15}%`,
              animation: `float 3s ease-in-out ${i * 0.5}s infinite`,
            }}
          ></div>
        ))}
      </div>

      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }
      `}</style>

      <div className="relative z-10">
        {/* Header */}
        <div className="p-5 border-b border-blue-500/20">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <button
                onClick={() => navigate(-1)}
                className="w-10 h-10 bg-black/60 backdrop-blur-sm border border-blue-500/30 rounded-full flex items-center justify-center hover:bg-blue-900/30 transition-all hover:scale-105"
              >
                <ChevronLeft className="w-5 h-5 text-white" />
              </button>
              <div>
                <h1 className="text-2xl font-bold bg-linear-to-r from-blue-400 to-teal-300 bg-clip-text text-transparent">
                  Baru Diputar
                </h1>
                <p className="text-sm text-gray-400">
                  Riwayat pemutaran terbaru Anda
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={handleRefresh}
                className="w-10 h-10 bg-black/60 backdrop-blur-sm border border-blue-500/30 rounded-xl flex items-center justify-center hover:bg-blue-900/30 transition-all"
              >
                <RefreshCw className="w-4 h-4 text-blue-400" />
              </button>
              <div className="flex items-center gap-2">
                <button
                  onClick={handleRefresh}
                  disabled={refreshing}
                  className="w-10 h-10 bg-black/60 backdrop-blur-sm border border-blue-500/30 rounded-full flex items-center justify-center hover:bg-blue-900/30 transition-all hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <RefreshCw
                    className={`w-5 h-5 text-white ${refreshing ? "animate-spin" : ""}`}
                  />
                </button>
                <div className="w-12 h-12 rounded-2xl bg-linear-to-br from-blue-500/20 to-teal-500/20 flex items-center justify-center border border-blue-500/30">
                  <History className="w-6 h-6 text-blue-400" />
                </div>
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="px-3 py-1 bg-black/40 rounded-full border border-blue-500/30">
                <span className="text-xs text-gray-300">
                  <span className="text-blue-400 font-bold">{totalSongs}</span>{" "}
                  lagu
                </span>
              </div>
              <div className="flex items-center gap-1 text-xs text-gray-500">
                <Clock className="w-3 h-3 text-teal-400" />
                <span>Riwayat terbaru Anda</span>
              </div>
            </div>
            <div className="text-sm text-gray-400">
              Halaman <span className="text-white">{currentPage}</span> dari{" "}
              <span className="text-white">{totalPages}</span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 mb-6">
            <button
              onClick={handlePlayAll}
              className="flex-1 relative overflow-hidden group"
            >
              <div className="relative w-full bg-linear-to-r from-blue-600 to-teal-600 hover:from-blue-500 hover:to-teal-500 text-white font-semibold py-3.5 rounded-xl transition-all duration-300 active:scale-[0.98] flex items-center justify-center gap-2">
                <Play className="w-5 h-5" fill="white" />
                <span>Putar Semua Lagi</span>
              </div>
            </button>
            <button
              onClick={handleAddAllToQueue}
              className="flex-1 bg-black/60 backdrop-blur-sm border border-blue-500/30 hover:border-blue-500/50 text-white font-medium py-3.5 rounded-xl transition-all duration-200 flex items-center justify-center gap-2"
            >
              <Music className="w-5 h-5" />
              <span>Tambahkan ke Antrian</span>
            </button>
          </div>
        </div>

        {/* Songs List */}
        <div className="p-5">
          {currentSongs.length === 0 ? (
            <div className="text-center py-16">
              <div className="w-20 h-20 mx-auto mb-4 rounded-2xl bg-linear-to-br from-blue-500/10 to-teal-500/10 flex items-center justify-center border border-blue-500/20">
                <History className="w-10 h-10 text-blue-400/50" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">
                Belum Ada Riwayat
              </h3>
              <p className="text-gray-400 text-sm mb-6">
                Mulailah mendengarkan lagu untuk melihat riwayat pemutaran di
                sini
              </p>
              <button
                onClick={() => navigate("/explore")}
                className="px-4 py-2 bg-linear-to-r from-blue-600 to-teal-600 text-white rounded-xl text-sm font-medium hover:from-blue-500 hover:to-teal-500 transition-all"
              >
                Telusuri Lagu
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {currentSongs.map((song, index) => (
                <div
                  key={song.id}
                  onClick={() => navigate(`/song/${song.id}`)}
                  className="bg-black/60 backdrop-blur-lg rounded-2xl p-4 border border-blue-500/20 hover:border-blue-500/40 hover:shadow-lg hover:shadow-blue-900/20 transition-all duration-300 cursor-pointer group"
                >
                  <div className="flex items-center gap-4">
                    {/* Play Count & Time */}
                    <div className="shrink-0 w-10 text-center">
                      <div className="flex flex-col items-center">
                        <div className="w-8 h-8 rounded-lg bg-linear-to-br from-blue-500/10 to-teal-500/10 flex items-center justify-center border border-blue-500/20 mb-1">
                          <span className="text-xs font-bold text-blue-300">
                            {startIndex + index + 1}
                          </span>
                        </div>
                        {/* {song. && (
                          <span className="text-[10px] text-gray-500 mt-1">
                            {new Date(song.last_played_at).toLocaleTimeString('id-ID', { 
                              hour: '2-digit', 
                              minute: '2-digit' 
                            })}
                          </span>
                        )} */}
                      </div>
                    </div>

                    {/* Album Art */}
                    <div className="relative shrink-0">
                      <div className="relative">
                        <div className="w-14 h-14 rounded-xl overflow-hidden border border-blue-500/30">
                          <img
                            src={song.image_url || "/placeholder-album.jpg"}
                            alt={song.title}
                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                            onError={(e) => {
                              const target = e.target as HTMLImageElement;
                              target.src = "/placeholder-album.jpg";
                            }}
                          />
                        </div>
                        {isCurrentPlaying(song.id) && (
                          <div className="absolute -top-1 -right-1 w-4 h-4 bg-blue-500 rounded-full animate-ping"></div>
                        )}
                        {/* {song.play_count > 1 && (
                          <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-teal-500 rounded-full flex items-center justify-center border border-blue-500/30">
                            <span className="text-[10px] font-bold text-white">
                              x{song.play_count}
                            </span>
                          </div>
                        )} */}
                      </div>
                    </div>

                    {/* Song Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between mb-1">
                        <div className="flex-1 min-w-0">
                          <h3 className="text-sm font-semibold text-white truncate group-hover:text-blue-300 transition-colors">
                            {song.title}
                          </h3>
                          <p className="text-xs text-gray-400 truncate">
                            {song.artist || "Artis Tidak Diketahui"}
                          </p>
                        </div>
                        <div className="ml-2 flex items-center gap-2">
                          {song.album && (
                            <span className="text-xs px-2 py-1 bg-black/40 rounded-full text-gray-400 hidden sm:block border border-gray-800">
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
                          <span className="text-xs px-2 py-1 bg-linear-to-r from-blue-500/10 to-teal-500/10 rounded-full text-blue-300 border border-blue-500/20">
                            {song.genre}
                          </span>
                        )}
                        {/* {song.last_played_at && (
                          <div className="flex items-center gap-1 text-xs text-gray-500">
                            <History className="w-3 h-3 text-teal-400" />
                            <span>
                              {new Date(song.last_played_at).toLocaleDateString(
                                "id-ID",
                                {
                                  day: "numeric",
                                  month: "short",
                                },
                              )}
                            </span>
                          </div>
                        )} */}
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2">
                      <button
                        onClick={(e) => handleLikeSong(song, e)}
                        disabled={isLikeLoading(song.id)}
                        className={`p-2 rounded-xl transition-all duration-200 ${
                          song.is_liked
                            ? "bg-linear-to-r from-pink-500/20 to-purple-500/20 text-pink-400 border border-pink-500/30 hover:border-pink-500/50"
                            : "bg-black/40 hover:bg-blue-900/30 text-gray-400 border border-gray-800 hover:border-blue-500/30"
                        }`}
                      >
                        {isLikeLoading(song.id) ? (
                          <div className="w-4 h-4 border-2 border-current/30 border-t-current rounded-full animate-spin"></div>
                        ) : (
                          <Heart
                            className={`w-4 h-4 ${song.is_liked ? "fill-current" : ""}`}
                          />
                        )}
                      </button>
                      <button
                        onClick={(e) => handlePlaySong(song, e)}
                        disabled={isPlayLoading(song.id)}
                        className={`p-2 rounded-xl transition-all duration-200 ${
                          isCurrentPlaying(song.id)
                            ? "bg-linear-to-r from-blue-500/20 to-teal-500/20 text-blue-400 border border-blue-500/30"
                            : "bg-black/40 hover:bg-blue-900/30 text-gray-400 border border-gray-800 hover:border-blue-500/30"
                        }`}
                      >
                        {isPlayLoading(song.id) ? (
                          <div className="w-4 h-4 border-2 border-current/30 border-t-current rounded-full animate-spin"></div>
                        ) : (
                          <Play
                            className={`w-4 h-4 ${isCurrentPlaying(song.id) ? "fill-current" : ""}`}
                          />
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="mt-8 bg-black/60 backdrop-blur-lg rounded-2xl p-4 border border-blue-500/20">
              <div className="flex items-center justify-between">
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="w-10 h-10 bg-black/40 border border-blue-500/30 rounded-xl flex items-center justify-center hover:bg-blue-900/30 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                >
                  <ChevronLeft className="w-5 h-5 text-white" />
                </button>

                <div className="flex items-center gap-2">
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
                        className={`w-10 h-10 rounded-xl font-medium transition-all duration-200 ${
                          currentPage === pageNum
                            ? "bg-linear-to-r from-blue-600 to-teal-600 text-white shadow-lg shadow-blue-900/30"
                            : "bg-black/40 hover:bg-blue-900/30 text-gray-300 border border-gray-800"
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
                  className="w-10 h-10 bg-black/40 border border-blue-500/30 rounded-xl flex items-center justify-center hover:bg-blue-900/30 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                >
                  <ChevronRight className="w-5 h-5 text-white" />
                </button>
              </div>
            </div>
          )}

          {/* Footer Info */}
          <div className="mt-6 text-center">
            <p className="text-xs text-gray-500">
              Menampilkan {currentSongs.length} dari {totalSongs} lagu dalam
              riwayat
            </p>
            <div className="flex items-center justify-center gap-2 mt-2">
              <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-pulse"></div>
              <div className="w-1.5 h-1.5 bg-teal-500 rounded-full animate-pulse delay-150"></div>
              <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-pulse delay-300"></div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Glow */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-linear-to-r from-transparent via-blue-500 to-transparent"></div>
    </div>
  );
};

export default RecentSongPage;
