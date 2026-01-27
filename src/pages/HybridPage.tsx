import React, { useEffect } from "react";
import { Play, Sparkles, X } from "lucide-react";
import { usePlayer } from "../context/PlayerContext";
import { mockRecommendations } from "../utils/mockData";
import { useNavigate } from "react-router-dom";
import useApi from "../apis/api";
import { recommendationHybridApi } from "../apis/endpoints/recommendation";
import LoadingSpinner from "../components/common/LoadingSpinner";

const HybridPage: React.FC = () => {
  const { playSong } = usePlayer();
  const onBack = useNavigate();

  const hybridRecomm = useApi({ api: recommendationHybridApi });

  // Fetch hybrid recommendations only once on mount
  useEffect(() => {
    hybridRecomm.process({});
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Intentionally empty - only run once on mount

  const songHybrid = hybridRecomm.data?.data.recommendations ?? [];

  if (hybridRecomm.isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="pb-32">
      <div className="p-4 border-b border-zinc-800 flex items-center gap-4">
        <button
          onClick={() => onBack(-1)}
          className="w-10 h-10 bg-zinc-800 rounded-full flex items-center justify-center"
        >
          <X className="w-6 h-6 text-white" />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-white">Hybrid Mix</h1>
          <p className="text-sm text-zinc-400">
            AI-powered personalized recommendations
          </p>
        </div>
      </div>

      <div className="p-4">
        <div className="bg-gradient-to-r from-green-500/20 to-blue-500/20 rounded-lg p-4 mb-6 border border-green-500/30">
          <div className="flex items-center gap-2 mb-2">
            <Sparkles className="w-5 h-5 text-green-400" />
            <h3 className="font-semibold text-white">How it works</h3>
          </div>
          <p className="text-sm text-zinc-300">
            Combining audio features analysis with collaborative filtering to
            find the perfect match for your taste.
          </p>
        </div>

        <div className="space-y-3">
          {songHybrid.map((rec, idx) => (
            <div
              key={rec.song.id}
              className="bg-zinc-900/50 rounded-lg p-4 hover:bg-zinc-800/50 transition-all"
            >
              <div className="flex items-center gap-4 mb-3">
                <span className="text-2xl font-bold text-zinc-600 w-8 text-center">
                  {idx + 1}
                </span>
                <img
                  src={rec.song.image_url}
                  alt={rec.song.title}
                  className="w-16 h-16 rounded-md"
                />
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-white truncate">
                    {rec.song.title}
                  </h3>
                  <p className="text-sm text-zinc-400 truncate">
                    {rec.song.artist}
                  </p>
                </div>
                <button
                  onClick={() => playSong(rec.song)}
                  className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center hover:scale-110 transition-transform"
                >
                  <Play className="w-5 h-5 text-black ml-0.5" />
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                <div className="px-2 py-1 bg-green-500/20 rounded text-xs text-green-400 font-medium">
                  Hybrid: {(rec.score * 100).toFixed(0)}%
                </div>
                <div className="px-2 py-1 bg-zinc-800 rounded text-xs text-zinc-400">
                  {rec.explanation}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default HybridPage;
