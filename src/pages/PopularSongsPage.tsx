import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import useApi from "../apis/api";
import {
  TrendingUp,
  ChevronLeft,
  ChevronRight,
  Music,
  Play,
  Heart,
  Sparkles,
  MoreHorizontal,
  Plus,
  SkipForward,
  Pause,
} from "lucide-react";
import LoadingSpinner from "../components/common/LoadingSpinner";
import type { Song } from "../apis/models/models";
import { recommendationPopularApi } from "../apis/endpoints/recommendation";
import { useMusicPlayer } from "../hooks/useMusicPlayer";
import { useSongInteractions } from "../hooks/useSongsInteractions";
import { usePlayer } from "../context/PlayerContext";

const ITEMS_PER_PAGE = 10;

const PopularSongsPage = () => {
  const navigate = useNavigate();
  const player = usePlayer();

  // State
  const [songs, setSongs] = useState<Song[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalSongs, setTotalSongs] = useState(0);
  const [showActionsFor, setShowActionsFor] = useState<string | null>(null);

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
      } catch (error) {
        console.error("Like error:", error);
        toast.error("Gagal menyukai lagu");
      }
    },
    [handleLike],
  );

  const handleAddToQueue = useCallback(
    (e: React.MouseEvent, song: Song) => {
      e.stopPropagation();
      player.addToQueue(song);
      toast.success(`"${song.title}" ditambahkan ke antrian`);
      setShowActionsFor(null);
    },
    [player],
  );

  const handlePlayNext = useCallback(
    (e: React.MouseEvent, song: Song) => {
      e.stopPropagation();
      player.playNext(song);
      toast.success(`"${song.title}" akan diputar berikutnya`);
      setShowActionsFor(null);
    },
    [player],
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
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  const formatDuration = (ms: number) => {
    if (!ms) return "0:00";
    const minutes = Math.floor(ms / 60000);
    const seconds = Math.floor((ms % 60000) / 1000);
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-linear-to-br from-gray-900 via-purple-900/20 to-black flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-gray-900 via-purple-900/20 to-black pb-32">
      {/* Header - Sticky dengan backdrop blur */}
      <div className="sticky top-0 z-10 bg-black/80 backdrop-blur-xl border-b border-purple-500/20">
        <div className="px-4 py-3">
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate(-1)}
              className="w-10 h-10 bg-black/60 backdrop-blur-sm border border-purple-500/30 rounded-full flex items-center justify-center active:bg-purple-900/30 transition-all active:scale-95"
            >
              <ChevronLeft className="w-5 h-5 text-white" />
            </button>
            <div className="flex-1">
              <h1 className="text-xl font-bold bg-linear-to-r from-purple-400 to-pink-300 bg-clip-text text-transparent">
                Lagu Populer
              </h1>
              <p className="text-xs text-gray-400">
                Tren musik teratas saat ini
              </p>
            </div>
            <div className="w-10 h-10 rounded-xl bg-linear-to-br from-purple-500/20 to-pink-500/20 flex items-center justify-center border border-purple-500/30">
              <TrendingUp className="w-5 h-5 text-purple-400" />
            </div>
          </div>
        </div>
      </div>

      <div className="p-4">
        {/* Stats Row */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="px-2 py-1 bg-black/40 rounded-full border border-purple-500/30">
              <span className="text-xs text-gray-300">
                <span className="text-purple-400 font-bold">{totalSongs}</span>{" "}
                lagu
              </span>
            </div>
            <div className="flex items-center gap-1 text-xs text-gray-500">
              <Sparkles className="w-3 h-3 text-pink-400" />
              <span>Terpopuler</span>
            </div>
          </div>
          <div className="text-xs text-gray-400">
            {currentPage}/{totalPages}
          </div>
        </div>

        {/* Action Buttons - Grid for mobile */}
        <div className="grid grid-cols-2 gap-2 mb-4">
          <button
            onClick={handlePlayAll}
            className="bg-linear-to-r from-purple-600 to-pink-600 active:from-purple-500 active:to-pink-500 text-white font-medium py-3 rounded-xl transition-all active:scale-[0.98] flex items-center justify-center gap-2"
          >
            <Play className="w-4 h-4" fill="white" />
            <span className="text-sm">Putar Semua</span>
          </button>
          <button
            onClick={handleAddAllToQueue}
            className="bg-black/60 backdrop-blur-sm border border-purple-500/30 active:border-purple-500/50 text-white font-medium py-3 rounded-xl transition-all flex items-center justify-center gap-2"
          >
            <Music className="w-4 h-4" />
            <span className="text-sm">Ke Antrian</span>
          </button>
        </div>

        {/* Songs List */}
        {currentSongs.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 mx-auto mb-3 rounded-xl bg-linear-to-br from-purple-500/10 to-pink-500/10 flex items-center justify-center border border-purple-500/20">
              <Music className="w-8 h-8 text-purple-400/50" />
            </div>
            <h3 className="text-base font-semibold text-white mb-1">
              Tidak Ada Lagu
            </h3>
            <p className="text-gray-400 text-xs">
              Belum ada data lagu populer tersedia
            </p>
          </div>
        ) : (
          <div className="space-y-2">
            {currentSongs.map((song) => (
              <div
                key={song.id}
                onClick={() => navigate(`/song/${song.id}`)}
                className="bg-black/60 backdrop-blur-lg rounded-xl p-3 border border-purple-500/20 active:bg-black/80 transition-all duration-200"
              >
                <div className="flex items-center gap-3">
                  {/* Album Art with Play Button Overlay */}
                  <div className="relative shrink-0">
                    <div className="w-14 h-14 rounded-lg overflow-hidden border border-purple-500/30">
                      <img
                        src={song.image_url || "/placeholder-album.jpg"}
                        alt={song.title}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.src = "/placeholder-album.jpg";
                        }}
                      />

                      {/* Play Button Overlay */}
                      <button
                        onClick={(e) => handlePlaySong(song, e)}
                        disabled={isPlayLoading(song.id)}
                        className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 active:opacity-100 rounded-lg transition-opacity"
                      >
                        {isPlayLoading(song.id) ? (
                          <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                        ) : isCurrentPlaying(song.id) ? (
                          <Pause className="w-6 h-6 text-white" />
                        ) : (
                          <Play className="w-6 h-6 text-white" />
                        )}
                      </button>
                    </div>

                    {/* Playing Indicator */}
                    {isCurrentPlaying(song.id) && (
                      <div className="absolute -top-1 -right-1 w-2.5 h-2.5">
                        <div className="absolute inset-0 bg-purple-500 rounded-full animate-ping"></div>
                        <div className="absolute inset-0 bg-purple-500 rounded-full"></div>
                      </div>
                    )}
                  </div>

                  {/* Song Info */}
                  <div className="flex-1 min-w-0">
                    <h3
                      className={`text-sm font-medium truncate ${
                        isCurrentPlaying(song.id)
                          ? "text-purple-400"
                          : "text-white"
                      }`}
                    >
                      {song.title}
                    </h3>
                    <p className="text-xs text-gray-400 truncate">
                      {song.artist || "Artis Tidak Diketahui"}
                    </p>

                    {/* Metadata Row */}
                    <div className="flex items-center gap-2 mt-1">
                      {song.genre && (
                        <span className="text-[10px] px-1.5 py-0.5 bg-linear-to-r from-purple-500/10 to-pink-500/10 rounded-full text-purple-300 border border-purple-500/20">
                          {song.genre}
                        </span>
                      )}
                      <span className="text-[10px] text-gray-500">
                        {formatDuration(song.duration_ms)}
                      </span>
                      {song.popularity && (
                        <>
                          <span className="text-gray-600">•</span>
                          <span className="text-[10px] text-pink-400">
                            {song.popularity}%
                          </span>
                        </>
                      )}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-1">
                    {/* Like Button */}
                    <button
                      onClick={(e) => handleLikeSong(song, e)}
                      disabled={isLikeLoading(song.id)}
                      className={`p-2 rounded-full active:bg-gray-800/50 transition-colors ${
                        song.is_liked ? "text-pink-400" : "text-gray-400"
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

                    {/* More Actions */}
                    <div className="relative">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setShowActionsFor(
                            showActionsFor === song.id ? null : song.id,
                          );
                        }}
                        className="p-2 rounded-full active:bg-gray-800/50 transition-colors"
                      >
                        <MoreHorizontal className="w-4 h-4 text-gray-400" />
                      </button>

                      {/* Actions Popup */}
                      {showActionsFor === song.id && (
                        <>
                          <div
                            className="fixed inset-0 z-40"
                            onClick={(e) => {
                              e.stopPropagation();
                              setShowActionsFor(null);
                            }}
                          />

                          <div className="absolute right-0 bottom-full mb-2 z-50 min-w-36">
                            <div className="bg-gray-900 rounded-lg border border-gray-800 shadow-xl overflow-hidden">
                              <button
                                onClick={(e) => handleAddToQueue(e, song)}
                                className="w-full px-3 py-2.5 flex items-center gap-2 text-left active:bg-gray-800 transition-colors"
                              >
                                <Plus className="w-3.5 h-3.5 text-purple-400" />
                                <span className="text-xs text-white">
                                  Add to Queue
                                </span>
                              </button>
                              <button
                                onClick={(e) => handlePlayNext(e, song)}
                                className="w-full px-3 py-2.5 flex items-center gap-2 text-left active:bg-gray-800 transition-colors border-t border-gray-800"
                              >
                                <SkipForward className="w-3.5 h-3.5 text-pink-400" />
                                <span className="text-xs text-white">
                                  Play Next
                                </span>
                              </button>
                            </div>
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Pagination - Simplified for mobile */}
        {totalPages > 1 && (
          <div className="mt-6 backdrop-blur-lg rounded-xl p-3 border border-purple-500/20">
            <div className="flex items-center justify-between">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="w-9 h-9 bg-black/40 border border-purple-500/30 rounded-lg flex items-center justify-center active:bg-purple-900/30 disabled:opacity-50 disabled:active:bg-transparent transition-all"
              >
                <ChevronLeft className="w-4 h-4 text-white" />
              </button>

              <div className="flex items-center gap-1">
                {Array.from({ length: Math.min(3, totalPages) }, (_, i) => {
                  let pageNum;
                  if (totalPages <= 3) {
                    pageNum = i + 1;
                  } else if (currentPage <= 2) {
                    pageNum = i + 1;
                  } else if (currentPage >= totalPages - 1) {
                    pageNum = totalPages - 2 + i;
                  } else {
                    pageNum = currentPage - 1 + i;
                  }

                  return (
                    <button
                      key={pageNum}
                      onClick={() => handlePageChange(pageNum)}
                      className={`w-9 h-9 rounded-lg text-sm font-medium transition-all ${
                        currentPage === pageNum
                          ? "bg-linear-to-r from-purple-600 to-pink-600 text-white"
                          : "bg-black/40 hover:bg-purple-900/30 text-gray-300"
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
                className="w-9 h-9 bg-black/40 border border-purple-500/30 rounded-lg flex items-center justify-center active:bg-purple-900/30 disabled:opacity-50 disabled:active:bg-transparent transition-all"
              >
                <ChevronRight className="w-4 h-4 text-white" />
              </button>
            </div>
          </div>
        )}

        {/* Footer Info */}
        <div className="mt-4 text-center">
          <p className="text-xs text-gray-500">
            {currentSongs.length} dari {totalSongs} lagu
          </p>
        </div>
      </div>
    </div>
  );
};

export default PopularSongsPage;
