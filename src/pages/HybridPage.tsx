import React, { useEffect } from "react";
import { Play, Sparkles, X } from "lucide-react";
import { usePlayer } from "../context/PlayerContext";
import { useNavigate } from "react-router-dom";
import useApi from "../apis/api";
import { recommendationHybridApi } from "../apis/endpoints/recommendation";
import LoadingSpinner from "../components/common/LoadingSpinner";

const HybridPage: React.FC = () => {
  const { playSong } = usePlayer();
  const onBack = useNavigate();

  const hybridRecomm = useApi({ api: recommendationHybridApi });

  // Ambil rekomendasi hybrid hanya sekali saat mount
  useEffect(() => {
    hybridRecomm.process({});
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Sengaja kosong - hanya berjalan sekali saat mount

  const songHybrid = hybridRecomm.data?.data.recommendations ?? [];

  if (hybridRecomm.isLoading) {
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
            className="absolute w-1 h-1 bg-purple-500/30 rounded-full"
            style={{
              left: `${10 + i * 20}%`,
              top: `${15 + i * 15}%`,
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
            <h1 className="text-2xl font-bold bg-linear-to-r from-purple-400 to-pink-300 bg-clip-text text-transparent">
              Hybrid Mix
            </h1>
            <p className="text-sm text-gray-400">
              Rekomendasi personal dari AI
            </p>
          </div>
          <div className="ml-auto">
            <div className="w-10 h-10 rounded-xl bg-linear-to-br from-purple-500/20 to-pink-500/20 flex items-center justify-center border border-purple-500/30">
              <Sparkles className="w-5 h-5 text-purple-400" />
            </div>
          </div>
        </div>

        <div className="p-5">
          {/* Info Card */}
          <div className="bg-black/60 backdrop-blur-lg rounded-2xl p-5 mb-6 border border-purple-500/20 shadow-xl shadow-purple-900/20">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-xl bg-linear-to-br from-purple-500/20 to-pink-500/20 flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-purple-400" />
              </div>
              <div>
                <h3 className="font-semibold text-white">Cara Kerjanya</h3>
                <p className="text-xs text-gray-400">
                  AI cerdas untuk musik Anda
                </p>
              </div>
            </div>
            <p className="text-sm text-gray-300 leading-relaxed">
              Menggabungkan analisis fitur audio dengan collaborative filtering
              untuk menemukan lagu yang sempurna sesuai selera Anda.
            </p>
          </div>

          {/* Results Section */}
          <div className="mb-4">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-1.5 h-1.5 rounded-full bg-linear-to-r from-purple-500 to-pink-500"></div>
              <h2 className="text-lg font-semibold text-white">
                Rekomendasi Hybrid
              </h2>
              <span className="ml-2 px-2 py-1 bg-purple-900/40 rounded-full text-xs text-purple-300">
                {songHybrid.length} lagu
              </span>
            </div>

            <div className="space-y-4">
              {songHybrid.map((rec, idx) => (
                <div
                  key={idx}
                  className="bg-black/60 backdrop-blur-lg rounded-2xl p-4 border border-purple-500/20 hover:border-purple-500/40 hover:shadow-lg hover:shadow-purple-900/20 transition-all duration-300"
                >
                  <div className="flex items-center gap-4 mb-4">
                    {/* Album Image */}
                    <div className="relative">
                      <div className="w-16 h-16 rounded-xl overflow-hidden border border-purple-500/30">
                        <img
                          src={rec.song.image_url}
                          alt={rec.song.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="absolute -top-1 -right-1 w-5 h-5 bg-purple-500 rounded-full animate-ping opacity-70"></div>
                    </div>

                    {/* Song Info */}
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-white truncate text-lg">
                        {rec.song.title}
                      </h3>
                      <p className="text-sm text-gray-400 truncate">
                        {rec.song.artist}
                      </p>
                      <div className="flex items-center gap-2 mt-1">
                        <div className="flex items-center gap-1">
                          <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></div>
                          <span className="text-xs text-gray-500">
                            Cocok {(rec.score * 100).toFixed(0)}%
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Play Button */}
                    <button
                      onClick={() => playSong(rec.song)}
                      className="relative overflow-hidden group"
                    >
                      <div className="w-12 h-12 bg-linear-to-r from-purple-600 to-pink-600 rounded-full flex items-center justify-center hover:from-purple-500 hover:to-pink-500 hover:scale-110 transition-all duration-300">
                        <Play className="w-5 h-5 text-white ml-0.5" />
                      </div>
                    </button>
                  </div>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-2">
                    <div className="px-3 py-1 bg-linear-to-r from-purple-500/20 to-pink-500/20 rounded-full text-xs text-purple-300 font-medium border border-purple-500/30">
                      Hybrid: {(rec.score * 100).toFixed(0)}%
                    </div>
                    <div className="px-3 py-1 bg-black/40 rounded-full text-xs text-gray-400 border border-gray-700">
                      {rec.explanation}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Glow */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-linear-to-r from-transparent via-purple-500 to-transparent"></div>
    </div>
  );
};

export default HybridPage;
