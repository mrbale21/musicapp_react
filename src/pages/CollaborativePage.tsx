import React, { useEffect, useState } from "react";
import {
  Play,
  X,
  Users,
  Plus,
  SkipForward,
  MoreHorizontal,
  Heart,
} from "lucide-react";
import { usePlayer } from "../context/PlayerContext";
import { useNavigate } from "react-router-dom";
import useApi from "../apis/api";
import { recommendationCollabApi } from "../apis/endpoints/recommendation";
import LoadingSpinner from "../components/common/LoadingSpinner";
import type { Song } from "../apis/models/models";
import { toast } from "react-toastify";

const CollaborativePage: React.FC = () => {
  const { playSong, addToQueue, playNext } = usePlayer();
  const navigate = useNavigate();
  const [likedSongs, setLikedSongs] = useState<Set<string>>(new Set());
  const [showActionsFor, setShowActionsFor] = useState<string | null>(null);

  const collaborativeRecomm = useApi({ api: recommendationCollabApi });

  useEffect(() => {
    collaborativeRecomm.process({});
  }, []);

  // Load liked songs from localStorage
  useEffect(() => {
    const liked = JSON.parse(localStorage.getItem("user_liked_songs") || "[]");
    setLikedSongs(new Set(liked.map((s: Song) => s.id)));
  }, []);

  const songCollab = collaborativeRecomm.data?.data.recommendations ?? [];

  const handleLike = (e: React.MouseEvent, song: Song) => {
    e.stopPropagation();

    // Update local state
    setLikedSongs((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(song.id)) {
        newSet.delete(song.id);
        toast.info(`Removed "${song.title}" from likes`);
      } else {
        newSet.add(song.id);
        toast.success(`Added "${song.title}" to likes`);
      }

      // Update localStorage
      const likedSongsArray = Array.from(newSet)
        .map((id) => songCollab.find((r) => r.song.id === id)?.song)
        .filter(Boolean);

      localStorage.setItem("user_liked_songs", JSON.stringify(likedSongsArray));

      return newSet;
    });
  };

  const handleAddToQueue = (e: React.MouseEvent, song: Song) => {
    e.stopPropagation();
    addToQueue(song);
    toast.success(`"${song.title}" added to queue`);
    setShowActionsFor(null);
  };

  const handlePlayNext = (e: React.MouseEvent, song: Song) => {
    e.stopPropagation();
    playNext(song);
    toast.success(`"${song.title}" will play next`);
    setShowActionsFor(null);
  };

  const handlePlay = (e: React.MouseEvent, song: Song) => {
    e.stopPropagation();
    playSong(song);
    toast.info(`Now playing "${song.title}"`);
  };

  const handleCardClick = (songId: string) => {
    navigate(`/song/${songId}`);
  };

  if (collaborativeRecomm.isLoading) {
    return (
      <div className="min-h-screen bg-linear-to-br from-gray-900 via-purple-900/20 to-black flex items-center justify-center relative overflow-hidden">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-20 -right-20 w-60 h-60 bg-purple-600/30 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute -bottom-20 -left-20 w-60 h-60 bg-blue-600/30 rounded-full blur-3xl animate-pulse delay-700"></div>
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
        <div className="absolute -bottom-20 -left-20 w-60 h-60 bg-blue-600/30 rounded-full blur-3xl animate-pulse delay-700"></div>
      </div>

      {/* Animated Particles */}
      <div className="absolute inset-0">
        {[...Array(5)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-blue-500/30 rounded-full"
            style={{
              left: `${15 + i * 18}%`,
              top: `${20 + i * 12}%`,
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
        {/* Header Section */}
        <div className="p-4 border-b border-purple-500/20 flex items-center gap-3 sticky top-0 bg-black/80 backdrop-blur-xl z-10">
          <button
            onClick={() => navigate(-1)}
            className="w-10 h-10 bg-black/60 backdrop-blur-sm border border-purple-500/30 rounded-full flex items-center justify-center active:bg-purple-900/30 transition-all active:scale-95"
          >
            <X className="w-5 h-5 text-white" />
          </button>
          <div className="flex-1">
            <h1 className="text-xl font-bold bg-linear-to-r from-blue-400 to-purple-300 bg-clip-text text-transparent">
              Pilihan Kolaboratif
            </h1>
            <p className="text-xs text-gray-400">
              Berdasarkan pengguna dengan selera serupa
            </p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-linear-to-br from-blue-500/20 to-purple-500/20 flex items-center justify-center border border-blue-500/30">
            <Users className="w-5 h-5 text-blue-400" />
          </div>
        </div>

        <div className="p-4">
          {/* Info Card - Simplified for mobile */}
          <div className="bg-black/60 backdrop-blur-lg rounded-2xl p-5 mb-6 border border-blue-500/20 shadow-xl shadow-blue-900/20">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-xl bg-linear-to-br from-blue-500/20 to-purple-500/20 flex items-center justify-center">
                <Users className="w-5 h-5 text-blue-400" />
              </div>
              <div>
                <h3 className="font-semibold text-white">
                  Rekomendasi Komunitas
                </h3>
                <p className="text-xs text-gray-400">
                  Dari pengguna dengan selera mirip
                </p>
              </div>
            </div>
            <p className="text-sm text-gray-300 leading-relaxed">
              Sistem ini menemukan song yang disukai oleh pengguna lain yang
              memiliki pola mendengarkan serupa dengan Anda. Semakin tinggi
              persentase kecocokan, semakin besar kemungkinan Anda akan menyukai
              song ini.
            </p>
          </div>

          {/* Results Section */}
          <div className="mb-4">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-1 h-1 rounded-full bg-linear-to-r from-blue-500 to-purple-500"></div>
              <h2 className="text-base font-semibold text-white">
                Rekomendasi Untuk Anda
              </h2>
              <span className="ml-auto px-2 py-0.5 bg-blue-900/40 rounded-full text-xs text-blue-300">
                {songCollab.length} lagu
              </span>
            </div>

            <div className="space-y-3">
              {songCollab.map((rec, idx) => (
                <div
                  key={idx}
                  onClick={() => handleCardClick(rec.song.id)}
                  className="bg-black/60 backdrop-blur-lg rounded-xl p-3 border border-blue-500/20 active:bg-black/80 transition-all duration-200"
                >
                  {/* Main Row */}
                  <div className="flex items-center gap-3">
                    {/* Album Image */}
                    <div className="relative">
                      <div className="w-14 h-14 rounded-lg overflow-hidden border border-blue-500/30">
                        <img
                          src={rec.song.image_url || "/placeholder-album.jpg"}
                          alt={rec.song.title}
                          className="w-full h-full object-cover"
                        />
                      </div>

                      {/* Play Button Overlay - Minimal */}
                      <button
                        onClick={(e) => handlePlay(e, rec.song)}
                        className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 active:opacity-100 rounded-lg transition-opacity"
                      >
                        <Play className="w-6 h-6 text-white" />
                      </button>
                    </div>

                    {/* Song Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between">
                        <div className="flex-1 min-w-0 pr-2">
                          <h3 className="font-medium text-white truncate text-sm">
                            {rec.song.title}
                          </h3>
                          <p className="text-xs text-gray-400 truncate">
                            {rec.song.artist}
                          </p>
                        </div>
                        <div className="shrink-0 px-2 py-0.5 bg-linear-to-r from-blue-500/20 to-purple-500/20 rounded-full text-[10px] text-blue-300 font-medium border border-blue-500/30">
                          {(rec.score * 100).toFixed(0)}%
                        </div>
                      </div>

                      {/* Metadata Row */}
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-[10px] text-gray-500">
                          {Math.floor(rec.song.duration_ms / 60000)}:
                          {((rec.song.duration_ms % 60000) / 1000)
                            .toFixed(0)
                            .padStart(2, "0")}
                        </span>
                        {rec.song.genre && (
                          <>
                            <span className="text-gray-600">•</span>
                            <span className="text-[10px] text-purple-400 bg-purple-900/30 px-1.5 py-0.5 rounded-full">
                              {rec.song.genre}
                            </span>
                          </>
                        )}
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex items-center gap-1">
                      {/* Like Button */}
                      <button
                        onClick={(e) => handleLike(e, rec.song)}
                        className="p-2 rounded-full active:bg-gray-800/50 transition-colors"
                      >
                        <Heart
                          className={`w-5 h-5 ${
                            likedSongs.has(rec.song.id)
                              ? "fill-pink-400 text-pink-400"
                              : "text-gray-400"
                          }`}
                        />
                      </button>

                      {/* More Actions Button */}
                      <div className="relative">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setShowActionsFor(
                              showActionsFor === rec.song.id
                                ? null
                                : rec.song.id,
                            );
                          }}
                          className="p-2 rounded-full active:bg-gray-800/50 transition-colors"
                        >
                          <MoreHorizontal className="w-5 h-5 text-gray-400" />
                        </button>

                        {/* Actions Popup */}
                        {showActionsFor === rec.song.id && (
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
                                  onClick={(e) => handleAddToQueue(e, rec.song)}
                                  className="w-full px-3 py-2.5 flex items-center gap-2 text-left active:bg-gray-800 transition-colors"
                                >
                                  <Plus className="w-4 h-4 text-purple-400" />
                                  <span className="text-xs text-white">
                                    Add to Queue
                                  </span>
                                </button>
                                <button
                                  onClick={(e) => handlePlayNext(e, rec.song)}
                                  className="w-full px-3 py-2.5 flex items-center gap-2 text-left active:bg-gray-800 transition-colors border-t border-gray-800"
                                >
                                  <SkipForward className="w-4 h-4 text-pink-400" />
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

                  {/* Explanation - Collapsible for mobile */}
                  {rec.explanation && (
                    <div className="mt-2 pt-2 border-t border-gray-800/50">
                      <p className="text-[10px] text-gray-400 leading-relaxed">
                        <span className="text-blue-400 font-medium">
                          Alasan:{" "}
                        </span>
                        {rec.explanation.length > 80
                          ? `${rec.explanation.substring(0, 80)}...`
                          : rec.explanation}
                      </p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Empty State */}
          {songCollab.length === 0 && !collaborativeRecomm.isLoading && (
            <div className="text-center py-8">
              <div className="w-16 h-16 mx-auto mb-3 rounded-xl bg-linear-to-br from-blue-500/10 to-purple-500/10 flex items-center justify-center border border-blue-500/20">
                <Users className="w-8 h-8 text-blue-400/50" />
              </div>
              <h3 className="text-base font-semibold text-white mb-1">
                Belum Ada Data
              </h3>
              <p className="text-gray-400 text-xs">
                Mulailah mendengarkan lagu untuk mendapatkan rekomendasi
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Bottom Glow */}
      <div className="fixed bottom-0 left-0 right-0 h-12 bg-linear-to-t from-black/80 to-transparent pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-linear-to-r from-transparent via-blue-500 to-transparent"></div>
    </div>
  );
};

export default CollaborativePage;
