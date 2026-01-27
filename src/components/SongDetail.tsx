import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import useApi from "../apis/api";
import { songUseApiById } from "../apis/endpoints/song";

const SongDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [song, setSong] = useState<any>(null);
  const [recommendations, _setRecommendations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [likedSongs, _setLikedSongs] = useState<Set<string>>(new Set());

  const songById = useApi({ api: songUseApiById });

  useEffect(() => {
    if (id) {
      setLoading(true);
      songById.process({ id });
    } else {
      console.error("Song ID is undefined");
      setError("Song ID is required");
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    if (songById.data) {
      setSong(songById.data.data || songById.data);
      setLoading(false);

      // Set liked status
      // if (songById.data) {
      //   setLikedSongs(prev => new Set([...prev, songById.data?.song_id]));
      // }
    }

    if (songById) {
      setError("Failed to load song");
      setLoading(false);
    }
  }, [songById.data, songById]);

  const handleToggleLike = () => {
    console.log("okee");
  };

  const handlePlayPreview = () => {
    if (song?.preview_url && song.preview_url !== "") {
      const audio = new Audio(song.preview_url);
      if (isPlaying) {
        audio.pause();
        setIsPlaying(false);
      } else {
        audio.play();
        setIsPlaying(true);

        audio.onended = () => setIsPlaying(false);
      }
    }
  };

  const formatDuration = (ms: number) => {
    const minutes = Math.floor(ms / 60000);
    const seconds = Math.floor((ms % 60000) / 1000);
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-linear-to-b from-spotify-dark to-black flex items-center justify-center">
        <div className="text-center">
          <i className="fas fa-spinner fa-spin text-4xl text-spotify-green mb-4"></i>
          <h1 className="text-xl text-white">Loading song details...</h1>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-linear-to-b from-spotify-dark to-black flex items-center justify-center">
        <div className="text-center">
          <i className="fas fa-exclamation-triangle text-4xl text-red-500 mb-4"></i>
          <h1 className="text-2xl text-white mb-2">Error loading song</h1>
          <p className="text-spotify-gray mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-2 bg-spotify-green text-white rounded-full hover:bg-green-500 transition-colors mr-3"
          >
            Retry
          </button>
          <button
            onClick={() => navigate("/")}
            className="px-6 py-2 bg-spotify-light-dark text-white rounded-full hover:bg-spotify-light-gray transition-colors"
          >
            Back to Home
          </button>
        </div>
      </div>
    );
  }

  if (!song) {
    return (
      <div className="min-h-screen bg-linear-to-b from-spotify-dark to-black flex items-center justify-center">
        <div className="text-center">
          <i className="fas fa-music text-6xl text-spotify-gray mb-4"></i>
          <h1 className="text-2xl text-white mb-2">Song not found</h1>
          <button
            onClick={() => navigate("/")}
            className="px-6 py-2 bg-spotify-green text-white rounded-full hover:bg-green-500 transition-colors"
          >
            Back to Home
          </button>
        </div>
      </div>
    );
  }

  // Set liked status
  const isLiked = likedSongs.has(song.id) || song.is_liked || false;

  return (
    <div className="min-h-screen bg-linear-to-b from-spotify-dark to-black text-white pb-32">
      {/* Back Button */}
      <div className="sticky top-0 z-40 bg-linear-to-b from-black/70 to-transparent p-4">
        <button
          onClick={() => navigate(-1)}
          className="w-10 h-10 rounded-full bg-black/50 flex items-center justify-center hover:bg-black/70 transition-colors"
        >
          <i className="fas fa-chevron-left"></i>
        </button>
      </div>

      {/* Song Header */}
      <div className="px-6 pt-4">
        <div className="flex flex-col md:flex-row items-start md:items-end gap-6">
          {/* Album Art */}
          <div className="relative w-full md:w-60 md:h-60 shadow-2xl">
            <img
              src={song.image_url || "https://via.placeholder.com/300"}
              alt={song.title}
              className="w-full aspect-square rounded-2xl object-cover shadow-2xl"
            />
            <div className="absolute inset-0 bg-linear-to-t from-black/50 to-transparent rounded-2xl"></div>
          </div>

          {/* Song Info */}
          <div className="flex-1 pt-4 md:pt-0">
            <p className="text-sm text-spotify-gray mb-2">SONG</p>
            <h1 className="text-4xl md:text-6xl font-bold mb-4">
              {song.title}
            </h1>

            <div className="flex items-center flex-wrap gap-4 mb-6">
              <div className="flex items-center">
                <div className="w-8 h-8 rounded-full bg-spotify-green flex items-center justify-center mr-2">
                  <span className="text-white text-sm font-bold">
                    {song.artist?.charAt(0) || "A"}
                  </span>
                </div>
                <span className="font-medium">{song.artist}</span>
              </div>

              {song.album && (
                <>
                  <span className="text-spotify-gray">•</span>
                  <span className="text-spotify-gray">{song.album}</span>
                </>
              )}

              <span className="text-spotify-gray">•</span>
              <span className="text-spotify-gray">
                {song.created_at
                  ? new Date(song.created_at).getFullYear()
                  : "Unknown year"}
              </span>

              <span className="text-spotify-gray">•</span>
              <span className="text-spotify-gray">
                {formatDuration(song.duration_ms || 0)}
              </span>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center space-x-4 mb-8">
              <button
                onClick={handlePlayPreview}
                disabled={!song.preview_url || song.preview_url === ""}
                className={`flex items-center justify-center w-14 h-14 rounded-full shadow-lg ${
                  song.preview_url && song.preview_url !== ""
                    ? "bg-spotify-green hover:bg-green-500 hover:scale-105"
                    : "bg-spotify-gray cursor-not-allowed"
                } transition-all duration-200`}
              >
                <i
                  className={`fas ${
                    isPlaying ? "fa-pause" : "fa-play"
                  } text-xl`}
                ></i>
              </button>

              <button
                onClick={handleToggleLike}
                className={`w-12 h-12 rounded-full flex items-center justify-center border-2 ${
                  isLiked
                    ? "border-spotify-green text-spotify-green hover:text-green-400"
                    : "border-spotify-gray text-spotify-gray hover:text-white hover:border-white"
                } transition-colors`}
              >
                <i
                  className={`fas ${isLiked ? "fa-heart" : "fa-heart"} text-lg`}
                ></i>
              </button>

              <button className="w-12 h-12 rounded-full flex items-center justify-center border-2 border-spotify-gray text-spotify-gray hover:text-white hover:border-white transition-colors">
                <i className="fas fa-ellipsis-h"></i>
              </button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {song.popularity !== undefined && (
                <div className="bg-spotify-light-dark/50 rounded-xl p-4">
                  <div className="flex items-center">
                    <div className="w-10 h-10 rounded-full bg-yellow-500/20 flex items-center justify-center mr-3">
                      <i className="fas fa-fire text-yellow-500"></i>
                    </div>
                    <div>
                      <p className="text-spotify-gray text-sm">Popularity</p>
                      <p className="text-white font-bold text-xl">
                        {Math.round(song.popularity)}/100
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {song.danceability !== undefined && (
                <div className="bg-spotify-light-dark/50 rounded-xl p-4">
                  <div className="flex items-center">
                    <div className="w-10 h-10 rounded-full bg-pink-500/20 flex items-center justify-center mr-3">
                      <i className="fas fa-shoe-prints text-pink-500"></i>
                    </div>
                    <div>
                      <p className="text-spotify-gray text-sm">Danceability</p>
                      <p className="text-white font-bold text-xl">
                        {Math.round((song.danceability || 0) * 100)}%
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {song.energy !== undefined && (
                <div className="bg-spotify-light-dark/50 rounded-xl p-4">
                  <div className="flex items-center">
                    <div className="w-10 h-10 rounded-full bg-red-500/20 flex items-center justify-center mr-3">
                      <i className="fas fa-bolt text-red-500"></i>
                    </div>
                    <div>
                      <p className="text-spotify-gray text-sm">Energy</p>
                      <p className="text-white font-bold text-xl">
                        {Math.round((song.energy || 0) * 100)}%
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {song.tempo !== undefined && (
                <div className="bg-spotify-light-dark/50 rounded-xl p-4">
                  <div className="flex items-center">
                    <div className="w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center mr-3">
                      <i className="fas fa-tachometer-alt text-blue-500"></i>
                    </div>
                    <div>
                      <p className="text-spotify-gray text-sm">Tempo</p>
                      <p className="text-white font-bold text-xl">
                        {Math.round(song.tempo || 0)} BPM
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Audio Features Visualization */}
      <div className="px-6 mt-8">
        <h2 className="text-2xl font-bold mb-6">Audio Features</h2>
        <div className="bg-spotify-light-dark/30 rounded-2xl p-6">
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {[
              {
                label: "Acousticness",
                value: song.acousticness || 0,
                color: "bg-green-500",
              },
              {
                label: "Instrumentalness",
                value: song.instrumentalness || 0,
                color: "bg-purple-500",
              },
              {
                label: "Liveness",
                value: song.liveness || 0,
                color: "bg-orange-500",
              },
              {
                label: "Speechiness",
                value: song.speechiness || 0,
                color: "bg-cyan-500",
              },
              {
                label: "Valence",
                value: song.valence || 0,
                color: "bg-yellow-500",
              },
              {
                label: "Loudness",
                value: Math.min(1, ((song.loudness || -60) + 60) / 60),
                color: "bg-red-500",
                rawValue: song.loudness || 0,
              },
            ].map((feature, index) => (
              <div key={index} className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-spotify-gray">{feature.label}</span>
                  <span className="text-white font-medium">
                    {feature.label === "Loudness"
                      ? `${feature.rawValue?.toFixed(1)} dB`
                      : `${Math.round((feature.value || 0) * 100)}%`}
                  </span>
                </div>
                <div className="h-2 bg-spotify-dark rounded-full overflow-hidden">
                  <div
                    className={`h-full ${feature.color} rounded-full transition-all duration-500`}
                    style={{
                      width: `${Math.min(100, (feature.value || 0) * 100)}%`,
                    }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recommendations Section */}
      <div className="px-6 mt-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold">Similar Songs</h2>
            <p className="text-spotify-gray">Content-based recommendations</p>
          </div>
          <span className="px-3 py-1 bg-spotify-green/20 text-spotify-green rounded-full text-sm">
            AI Powered
          </span>
        </div>

        {recommendations.length > 0 ? (
          <div className="space-y-2">{/* Render recommendations here */}</div>
        ) : (
          <div className="bg-spotify-light-dark/30 rounded-2xl p-8 text-center">
            <i className="fas fa-robot text-4xl text-spotify-gray mb-4"></i>
            <h3 className="text-white text-lg mb-2">No recommendations yet</h3>
            <p className="text-spotify-gray">
              Try listening to more songs to get personalized recommendations
            </p>
          </div>
        )}
      </div>

      {/* Fixed Play Bar */}
      {song.preview_url && song.preview_url !== "" && (
        <div className="fixed bottom-0 left-0 right-0 bg-linear-to-t from-black to-transparent p-4">
          <div className="bg-spotify-light-dark rounded-xl p-4 max-w-4xl mx-auto shadow-2xl">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <img
                  src={song.image_url || "https://via.placeholder.com/48"}
                  alt={song.title}
                  className="w-12 h-12 rounded mr-4"
                />
                <div>
                  <h4 className="text-white font-medium">{song.title}</h4>
                  <p className="text-spotify-gray text-sm">{song.artist}</p>
                </div>
              </div>

              <div className="flex items-center space-x-4">
                <button
                  onClick={handleToggleLike}
                  className={`${
                    isLiked ? "text-spotify-green" : "text-spotify-gray"
                  } hover:text-white`}
                >
                  <i
                    className={`fas ${
                      isLiked ? "fa-heart" : "fa-heart"
                    } text-xl`}
                  ></i>
                </button>

                <button
                  onClick={handlePlayPreview}
                  className="w-12 h-12 rounded-full bg-spotify-green flex items-center justify-center hover:bg-green-500"
                >
                  <i
                    className={`fas ${
                      isPlaying ? "fa-pause" : "fa-play"
                    } text-white`}
                  ></i>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SongDetail;
