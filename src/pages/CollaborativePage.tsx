import React, { useEffect } from "react";
import { Play, X, Users } from "lucide-react";
import { usePlayer } from "../context/PlayerContext";
import { useNavigate } from "react-router-dom";
import useApi from "../apis/api";
import { recommendationCollabApi } from "../apis/endpoints/recommendation";
import LoadingSpinner from "../components/common/LoadingSpinner";

const CollaborativePage: React.FC = () => {
  const { playSong } = usePlayer();
  const onBack = useNavigate();

  const collaborativeRecomm = useApi({ api: recommendationCollabApi });

  // Ambil rekomendasi kolaboratif hanya sekali saat mount
  useEffect(() => {
    collaborativeRecomm.process({});
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Sengaja kosong - hanya berjalan sekali saat mount

  const songCollab = collaborativeRecomm.data?.data.recommendations ?? [];

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
        <div className="p-5 border-b border-purple-500/20 flex items-center gap-4">
          <button
            onClick={() => onBack(-1)}
            className="w-10 h-10 bg-black/60 backdrop-blur-sm border border-purple-500/30 rounded-full flex items-center justify-center hover:bg-purple-900/30 transition-all hover:scale-105"
          >
            <X className="w-5 h-5 text-white" />
          </button>
          <div>
            <h1 className="text-2xl font-bold bg-linear-to-r from-blue-400 to-purple-300 bg-clip-text text-transparent">
              Pilihan Kolaboratif
            </h1>
            <p className="text-sm text-gray-400">
              Berdasarkan pengguna dengan selera serupa
            </p>
          </div>
          <div className="ml-auto">
            <div className="w-10 h-10 rounded-xl bg-linear-to-br from-blue-500/20 to-purple-500/20 flex items-center justify-center border border-blue-500/30">
              <Users className="w-5 h-5 text-blue-400" />
            </div>
          </div>
        </div>

        <div className="p-5">
          {/* Info Card */}
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
            <div className="flex items-center gap-2 mb-4">
              <div className="w-1.5 h-1.5 rounded-full bg-linear-to-r from-blue-500 to-purple-500"></div>
              <h2 className="text-lg font-semibold text-white">
                Rekomendasi Untuk Anda
              </h2>
              <span className="ml-2 px-2 py-1 bg-blue-900/40 rounded-full text-xs text-blue-300">
                {songCollab.length} song
              </span>
            </div>

            <div className="space-y-4">
              {songCollab.map((rec, idx) => (
                <div
                  key={idx}
                  className="bg-black/60 backdrop-blur-lg rounded-2xl p-4 border border-blue-500/20 hover:border-blue-500/40 hover:shadow-lg hover:shadow-blue-900/20 transition-all duration-300"
                >
                  <div className="flex items-center gap-4 mb-3">
                    {/* Album Image */}
                    <div className="relative">
                      <div className="w-16 h-16 rounded-xl overflow-hidden border border-blue-500/30">
                        <img
                          src={rec.song.image_url}
                          alt={rec.song.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="absolute -top-1 -right-1 w-5 h-5 bg-blue-500 rounded-full animate-ping opacity-70"></div>
                    </div>

                    {/* Song Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <h3 className="font-semibold text-white truncate text-lg">
                          {rec.song.title}
                        </h3>
                        <div className="px-2 py-0.5 bg-linear-to-r from-blue-500/20 to-purple-500/20 rounded-full text-xs text-blue-300 font-medium border border-blue-500/30">
                          {(rec.score * 100).toFixed(0)}% cocok
                        </div>
                      </div>
                      <p className="text-sm text-gray-400 truncate">
                        {rec.song.artist}
                      </p>
                      <div className="flex items-center gap-2 mt-2">
                        <div className="flex items-center gap-1 text-xs text-gray-500">
                          <Users className="w-3 h-3 text-blue-400" />
                          <span>Pengguna serupa</span>
                        </div>
                      </div>
                    </div>

                    {/* Play Button */}
                    <button
                      onClick={() => playSong(rec.song)}
                      className="relative overflow-hidden group"
                    >
                      <div className="w-12 h-12 bg-linear-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center hover:from-blue-500 hover:to-purple-500 hover:scale-110 transition-all duration-300">
                        <Play className="w-5 h-5 text-white ml-0.5" />
                      </div>
                    </button>
                  </div>

                  {/* Explanation */}
                  {rec.explanation && (
                    <div className="mt-3 pt-3 border-t border-gray-800">
                      <p className="text-xs text-gray-400 leading-relaxed">
                        <span className="text-blue-400 font-medium">
                          Alasan:{" "}
                        </span>
                        {rec.explanation}
                      </p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Empty State */}
          {songCollab.length === 0 && !collaborativeRecomm.isLoading && (
            <div className="text-center py-10">
              <div className="w-20 h-20 mx-auto mb-4 rounded-2xl bg-linear-to-br from-blue-500/10 to-purple-500/10 flex items-center justify-center border border-blue-500/20">
                <Users className="w-10 h-10 text-blue-400/50" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">
                Belum Ada Data
              </h3>
              <p className="text-gray-400 text-sm">
                Mulailah mendengarkan song untuk mendapatkan rekomendasi dari
                pengguna lain
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Bottom Glow */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-linear-to-r from-transparent via-blue-500 to-transparent"></div>
    </div>
  );
};

export default CollaborativePage;
