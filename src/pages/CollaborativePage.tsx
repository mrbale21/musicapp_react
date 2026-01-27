import React, { useEffect } from "react";
import { Play, X } from "lucide-react";
import { usePlayer } from "../context/PlayerContext";
import { mockRecommendations } from "../utils/mockData";
import { useNavigate } from "react-router-dom";
import useApi from "../apis/api";
import { recommendationCollabApi } from "../apis/endpoints/recommendation";
import LoadingSpinner from "../components/common/LoadingSpinner";

const CollaborativePage: React.FC = () => {
  const { playSong } = usePlayer();
  const onBack = useNavigate();

  const collaborativeRecomm = useApi({ api: recommendationCollabApi });

  // Fetch collaborative recommendations only once on mount
  useEffect(() => {
    collaborativeRecomm.process({});
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Intentionally empty - only run once on mount

  const songCollab = collaborativeRecomm.data?.data.recommendations ?? [];

  if (collaborativeRecomm.isLoading) {
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
          <h1 className="text-2xl font-bold text-white">Collaborative Picks</h1>
          <p className="text-sm text-zinc-400">
            Based on users with similar taste
          </p>
        </div>
      </div>

      <div className="p-4">
        <div className="space-y-3">
          {songCollab.map((rec, idx) => (
            <div
              key={rec.song.id}
              className="bg-zinc-900/50 rounded-lg p-4 flex items-center gap-4 hover:bg-zinc-800/50 transition-all"
            >
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
                <div className="flex items-center gap-2 mt-1">
                  <div className="px-2 py-0.5 bg-blue-500/20 rounded text-xs text-blue-400 font-medium">
                    {(rec.score * 100).toFixed(0)}% match
                  </div>
                </div>
              </div>
              <button
                onClick={() => playSong(rec.song)}
                className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center hover:scale-110 transition-transform"
              >
                <Play className="w-5 h-5 text-black ml-0.5" />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CollaborativePage;
