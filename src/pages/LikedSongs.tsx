import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import useApi from "../apis/api";
import {
  Heart,
  ChevronLeft,
  ChevronRight,
  Music,
  Play,
  Sparkles,
} from "lucide-react";
import LoadingSpinner from "../components/common/LoadingSpinner";
import type { Song } from "../apis/models/models";
import { useMusicPlayer } from "../hooks/useMusicPlayer";
import { useSongInteractions } from "../hooks/useSongsInteractions";
import { usePlayer } from "../context/PlayerContext";
import { songUseLikesApi } from "../apis/endpoints/songlike";

const ITEMS_PER_PAGE = 15;

const LikedSongsPage = () => {
  const navigate = useNavigate();
  const player = usePlayer();

  // State
  const [songs, setSongs] = useState<Song[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalSongs, setTotalSongs] = useState(0);

  // API
  const likedSongsApi = useApi({
    api: songUseLikesApi,
    onSuccess: (data) => {
      if (data?.data) {
        const mappedSongs: Song[] = data.data.map((s: any) => ({
          ...s,
          is_liked: s.is_liked === "1" || s.is_liked === true,
        }));

        setSongs(mappedSongs);
        setTotalSongs(mappedSongs.length);
      }
      setLoading(false);
    },
    onFail: (error) => {
      console.error("Error fetching liked songs:", error);
      toast.error("Gagal memuat lagu favorit");
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
    likedSongsApi.process({});
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

    toast.success(`Memutar ${songsWithYouTube.length} lagu favorit!`);
  }, [songs, player, play]);

  const handlePageChange = useCallback((page: number) => {
    setCurrentPage(page);
    // Scroll to top
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-linear-to-br from-gray-900 via-purple-900/20 to-black flex items-center justify-center relative overflow-hidden">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-20 -right-20 w-60 h-60 bg-purple-600/30 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute -bottom-20 -left-20 w-60 h-60 bg-pink-600/30 rounded-full blur-3xl animate-pulse delay-700"></div>
        </div>
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-gray-900 via-purple-900/20 to-black pb-32 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-20 -right-20 w-60 h-60 bg-purple-600/30 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-20 -left-20 w-60 h-60 bg-pink-600/30 rounded-full blur-3xl animate-pulse delay-700"></div>
      </div>

      {/* Animated Particles */}
      <div className="absolute inset-0">
        {[...Array(5)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-pink-500/30 rounded-full"
            style={{
              left: `${8 + i * 20}%`,
              top: `${15 + i * 16}%`,
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
        <div className="p-5 border-b border-pink-500/20">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <button
                onClick={() => navigate(-1)}
                className="w-10 h-10 bg-black/60 backdrop-blur-sm border border-pink-500/30 rounded-full flex items-center justify-center hover:bg-pink-900/30 transition-all hover:scale-105"
              >
                <ChevronLeft className="w-5 h-5 text-white" />
              </button>
              <div>
                <h1 className="text-2xl font-bold bg-linear-to-r from-pink-400 to-purple-300 bg-clip-text text-transparent">
                  Lagu Favorit
                </h1>
                <p className="text-sm text-gray-400">
                  Koleksi lagu yang Anda sukai
                </p>
              </div>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-linear-to-br from-pink-500/20 to-purple-500/20 flex items-center justify-center border border-pink-500/30">
              <Heart className="w-6 h-6 text-pink-400" fill="currentColor" />
            </div>
          </div>

          {/* Stats */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="px-3 py-1 bg-black/40 rounded-full border border-pink-500/30">
                <span className="text-xs text-gray-300">
                  <span className="text-pink-400 font-bold">{totalSongs}</span>{" "}
                  lagu
                </span>
              </div>
              <div className="flex items-center gap-1 text-xs text-gray-500">
                <Heart className="w-3 h-3 text-pink-400" fill="currentColor" />
                <span>Dari koleksi Anda</span>
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
              <div className="relative w-full bg-linear-to-r from-pink-600 to-purple-600 hover:from-pink-500 hover:to-purple-500 text-white font-semibold py-3.5 rounded-xl transition-all duration-300 active:scale-[0.98] flex items-center justify-center gap-2">
                <Play className="w-5 h-5" fill="white" />
                <span>Putar Semua</span>
              </div>
            </button>
            <button
              onClick={handleAddAllToQueue}
              className="flex-1 bg-black/60 backdrop-blur-sm border border-pink-500/30 hover:border-pink-500/50 text-white font-medium py-3.5 rounded-xl transition-all duration-200 flex items-center justify-center gap-2"
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
              <div className="w-20 h-20 mx-auto mb-4 rounded-2xl bg-linear-to-br from-pink-500/10 to-purple-500/10 flex items-center justify-center border border-pink-500/20">
                <Heart className="w-10 h-10 text-pink-400/50" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">
                Belum Ada Lagu Favorit
              </h3>
              <p className="text-gray-400 text-sm mb-6">
                Tekan tombol hati pada lagu untuk menambahkannya ke sini
              </p>
              <button
                onClick={() => navigate("/explore")}
                className="px-4 py-2 bg-linear-to-r from-pink-600 to-purple-600 text-white rounded-xl text-sm font-medium hover:from-pink-500 hover:to-purple-500 transition-all"
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
                  className="bg-black/60 backdrop-blur-lg rounded-2xl p-4 border border-pink-500/20 hover:border-pink-500/40 hover:shadow-lg hover:shadow-pink-900/20 transition-all duration-300 cursor-pointer group"
                >
                  <div className="flex items-center gap-4">
                    {/* Song Number */}
                    <div className="shrink-0 w-8">
                      <div className="w-8 h-8 rounded-lg bg-linear-to-br from-pink-500/10 to-purple-500/10 flex items-center justify-center border border-pink-500/20">
                        <span className="text-sm font-medium text-pink-300">
                          {startIndex + index + 1}
                        </span>
                      </div>
                    </div>

                    {/* Album Art */}
                    <div className="relative shrink-0">
                      <div className="relative">
                        <div className="w-14 h-14 rounded-xl overflow-hidden border border-pink-500/30">
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
                          <div className="absolute -top-1 -right-1 w-4 h-4 bg-pink-500 rounded-full animate-ping"></div>
                        )}
                      </div>
                    </div>

                    {/* Song Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between mb-1">
                        <div className="flex-1 min-w-0">
                          <h3 className="text-sm font-semibold text-white truncate group-hover:text-pink-300 transition-colors">
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
                          <span className="text-xs px-2 py-1 bg-linear-to-r from-pink-500/10 to-purple-500/10 rounded-full text-pink-300 border border-pink-500/20">
                            {song.genre}
                          </span>
                        )}
                        {song.created_at && (
                          <div className="flex items-center gap-1 text-xs text-gray-500">
                            <Sparkles className="w-3 h-3 text-purple-400" />
                            <span>
                              Ditambahkan{" "}
                              {new Date(song.created_at).toLocaleDateString(
                                "id-ID",
                              )}
                            </span>
                          </div>
                        )}
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
                            : "bg-black/40 hover:bg-pink-900/30 text-gray-400 border border-gray-800 hover:border-pink-500/30"
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
                            ? "bg-linear-to-r from-pink-500/20 to-purple-500/20 text-pink-400 border border-pink-500/30"
                            : "bg-black/40 hover:bg-pink-900/30 text-gray-400 border border-gray-800 hover:border-pink-500/30"
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
            <div className="mt-8 bg-black/60 backdrop-blur-lg rounded-2xl p-4 border border-pink-500/20">
              <div className="flex items-center justify-between">
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="w-10 h-10 bg-black/40 border border-pink-500/30 rounded-xl flex items-center justify-center hover:bg-pink-900/30 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
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
                            ? "bg-linear-to-r from-pink-600 to-purple-600 text-white shadow-lg shadow-pink-900/30"
                            : "bg-black/40 hover:bg-pink-900/30 text-gray-300 border border-gray-800"
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
                  className="w-10 h-10 bg-black/40 border border-pink-500/30 rounded-xl flex items-center justify-center hover:bg-pink-900/30 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                >
                  <ChevronRight className="w-5 h-5 text-white" />
                </button>
              </div>
            </div>
          )}

          {/* Footer Info */}
          <div className="mt-6 text-center">
            <p className="text-xs text-gray-500">
              Menampilkan {currentSongs.length} dari {totalSongs} lagu favorit
            </p>
            <div className="flex items-center justify-center gap-2 mt-2">
              <div className="w-1.5 h-1.5 bg-pink-500 rounded-full animate-pulse"></div>
              <div className="w-1.5 h-1.5 bg-purple-500 rounded-full animate-pulse delay-150"></div>
              <div className="w-1.5 h-1.5 bg-pink-500 rounded-full animate-pulse delay-300"></div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Glow */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-linear-to-r from-transparent via-pink-500 to-transparent"></div>
    </div>
  );
};

export default LikedSongsPage;
