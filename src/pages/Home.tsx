// pages/Home.tsx
import React, { useEffect, useState } from "react";
import { useUserData } from "../hooks/zustand";
import useApi from "../apis/api";
import { songsUseApi } from "../apis/endpoints/song";
import RecommendationList from "../components/RecommendationList";
import type { Song } from "../apis/models/song";
import type { RecommendationItem } from "../apis/models/recommendation-content";
import { recommendationHybridApi } from "../apis/endpoints/recommendation";

interface HomePageProps {
  playingSongId: string | null;
  isPlaying: boolean;
  onPlaySong: (songId: string) => void;
  onToggleLike: (songId: string) => void;
}

interface RecommendationGroup {
  id: string;
  name: string;
  description: string;
  coverUrl: string;
  songs: Song[];
  type?: string;
}

const HomePage: React.FC<HomePageProps> = ({
  playingSongId,
  isPlaying,
  onPlaySong,
  onToggleLike,
}) => {
  const { user } = useUserData();
  const [songs, setSongs] = useState<Song[]>([]);
  const [recommendations, setRecommendations] = useState<RecommendationItem[]>(
    [],
  );
  const [filteredSongs, setFilteredSongs] = useState<Song[]>([]);
  const [loadingRecommendations, setLoadingRecommendations] = useState(false);

  const useSong = useApi({ api: songsUseApi });
  const useRecommendations = useApi({ api: recommendationHybridApi });

  useEffect(() => {
    // Fetch semua songs - only run once on mount
    useSong.process({});
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (songs.length > 0) {
      // Fetch recommendations untuk beberapa lagu populer
      const popularSongId = songs
        .filter((s) => s.preview_url && s.preview_url !== "")
        .sort((a, b) => (b.popularity || 0) - (a.popularity || 0))[0]?.id;

      if (popularSongId) {
        setLoadingRecommendations(true);
        useRecommendations.process({
          songId: popularSongId,
          type: "content", // atau "hybrid" tergantung endpoint
        });
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [songs]); // Only depend on songs, not API objects

  // Update state ketika data songs berhasil di-fetch
  useEffect(() => {
    if (useSong.data?.data) {
      const fetchedSongs: Song[] = useSong.data.data.map((song: any) => ({
        ...song,
        isLiked: song.is_liked || false,
      }));

      setSongs(fetchedSongs);

      // Filter songs yang memiliki preview
      const songsWithPreview = fetchedSongs.filter(
        (song: Song) => song.preview_url && song.preview_url !== "",
      );
      setFilteredSongs(songsWithPreview);
    }
  }, [useSong.data]);

  // Update state ketika data recommendations berhasil di-fetch
  // useEffect(() => {
  //   if (useRecommendations.data?.song) {

  //     // Tambahkan properti isLiked ke setiap song dalam recommendations
  //     const recommendationsWithLikes = recItems.map(rec => ({
  //       ...rec,
  //       song: {
  //         ...rec.song,
  //         isLiked: rec.song.isLiked || false,
  //       }
  //     }));

  //     setLoadingRecommendations(false);
  //   }

  //   if (useRecommendations) {
  //     console.error("Failed to fetch recommendations:", useRecommendations);
  //     setLoadingRecommendations(false);
  //   }
  // }, [useRecommendations.data, useRecommendations]);

  // Format data untuk RecommendationList
  const formatRecommendations = (): RecommendationGroup[] => {
    const groups: RecommendationGroup[] = [];

    // 1. Popular Tracks (dari filteredSongs)
    if (filteredSongs.length > 0) {
      groups.push({
        id: "popular",
        name: "Popular Tracks",
        description: "Based on your listening history",
        coverUrl: filteredSongs[0]?.image_url || "",
        songs: filteredSongs
          .sort((a, b) => (b.popularity || 0) - (a.popularity || 0))
          .slice(0, 5),
      });
    }

    // 2. New For You (dari filteredSongs, berdasarkan created_at)
    if (filteredSongs.length > 0) {
      const recentSongs = [...filteredSongs]
        .sort(
          (a, b) =>
            new Date(b.created_at || "").getTime() -
            new Date(a.created_at || "").getTime(),
        )
        .slice(0, 5);

      groups.push({
        id: "new-releases",
        name: "New For You",
        description: "Fresh tracks you might like",
        coverUrl: recentSongs[0]?.image_url || "",
        songs: recentSongs,
      });
    }

    // 3. AI Recommendations (dari API recommendations)
    if (recommendations.length > 0) {
      const recommendationSongs = recommendations.map((rec) => rec.song);

      groups.push({
        id: "ai-recommendations",
        name: "Recommended For You",
        description: "AI-powered suggestions based on your taste",
        coverUrl: recommendationSongs[0]?.image_url || "",
        songs: recommendationSongs.slice(0, 5),
        type: "content-based",
      });
    }

    // 4. Liked Songs (jika ada yang sudah dilike)
    const likedSongs = filteredSongs.filter((song) => song.isLiked);
    if (likedSongs.length > 0) {
      groups.push({
        id: "liked-songs",
        name: "Your Liked Songs",
        description: "Songs you've hearted",
        coverUrl: likedSongs[0]?.image_url || "",
        songs: likedSongs.slice(0, 5),
      });
    }

    return groups;
  };

  // Hitung jumlah lagu yang sudah dilike
  const likedCount = songs.filter((song) => song.isLiked).length;

  return (
    <div className="min-h-screen pb-24">
      {/* Header */}
      <div className="sticky top-0 z-30 bg-spotify-dark/90 backdrop-blur-md px-4 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-white">
              Good morning, {user?.username || "there"}!
            </h1>
            <div className="flex items-center space-x-4 mt-1">
              <p className="text-spotify-gray">
                {filteredSongs.length} songs available with preview
              </p>
              {filteredSongs.length < songs.length && (
                <span className="text-xs text-spotify-gray bg-spotify-dark px-2 py-1 rounded">
                  {songs.length - filteredSongs.length} without preview
                </span>
              )}
            </div>
          </div>
          {/* Profile section */}
          <div className="flex items-center space-x-3">
            <button className="p-2 rounded-full bg-spotify-light-dark hover:bg-spotify-light-gray">
              <i className="fas fa-bell text-white"></i>
            </button>
            <div className="w-10 h-10 rounded-full bg-spotify-green flex items-center justify-center">
              <span className="text-white font-bold">
                {user?.username?.charAt(0).toUpperCase() || "U"}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="px-4 pt-2">
        {/* Quick Actions with Filter */}
        <div className="flex space-x-3 mb-8 overflow-x-auto pb-2">
          <button
            className="shrink-0 px-4 py-2 bg-spotify-green text-white rounded-full hover:bg-green-500 transition-colors"
            onClick={() =>
              setFilteredSongs(
                songs.filter((s) => s.preview_url && s.preview_url !== ""),
              )
            }
          >
            <i className="fas fa-music mr-2"></i>
            With Preview (
            {songs.filter((s) => s.preview_url && s.preview_url !== "").length})
          </button>

          <button
            className="shrink-0 px-4 py-2 bg-spotify-light-dark text-white rounded-full hover:bg-spotify-light-gray transition-colors"
            onClick={() => setFilteredSongs(songs)}
          >
            All Songs ({songs.length})
          </button>

          {["Popular", "New", "Liked"].map((category) => (
            <button
              key={category}
              className="shrink-0 px-4 py-2 bg-spotify-light-dark text-white rounded-full hover:bg-spotify-light-gray transition-colors"
            >
              {category}
            </button>
          ))}
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-2 gap-3 mb-6">
          <div className="bg-spotify-light-dark rounded-xl p-4">
            <div className="flex items-center">
              <div className="w-10 h-10 rounded-full bg-spotify-green/20 flex items-center justify-center mr-3">
                <i className="fas fa-play text-spotify-green"></i>
              </div>
              <div>
                <p className="text-spotify-gray text-sm">Available Previews</p>
                <p className="text-white font-bold text-xl">
                  {
                    songs.filter((s) => s.preview_url && s.preview_url !== "")
                      .length
                  }
                </p>
              </div>
            </div>
          </div>

          <div className="bg-spotify-light-dark rounded-xl p-4">
            <div className="flex items-center">
              <div className="w-10 h-10 rounded-full bg-purple-500/20 flex items-center justify-center mr-3">
                <i className="fas fa-heart text-purple-500"></i>
              </div>
              <div>
                <p className="text-spotify-gray text-sm">Liked Songs</p>
                <p className="text-white font-bold text-xl">{likedCount}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Recommendations */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-white">Made For You</h2>
            {loadingRecommendations && (
              <div className="flex items-center text-spotify-gray">
                <i className="fas fa-spinner fa-spin mr-2"></i>
                <span className="text-sm">Loading AI recommendations...</span>
              </div>
            )}
          </div>

          {formatRecommendations().map((rec) => (
            <div key={rec.id} className="mb-6">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <h3 className="text-lg font-bold text-white">{rec.name}</h3>
                  <p className="text-spotify-gray text-sm">{rec.description}</p>
                </div>
                {rec.type && (
                  <span className="px-2 py-1 bg-spotify-green/20 text-spotify-green rounded-full text-xs">
                    AI Powered
                  </span>
                )}
              </div>
              <RecommendationList
                recommendation={rec}
                playingSongId={playingSongId}
                isPlaying={isPlaying}
                onPlaySong={onPlaySong}
                onToggleLike={onToggleLike}
              />
            </div>
          ))}

          {formatRecommendations().length === 0 && (
            <div className="bg-spotify-light-dark rounded-2xl p-8 text-center">
              <i className="fas fa-music text-4xl text-spotify-gray mb-4"></i>
              <h3 className="text-white text-lg mb-2">No songs available</h3>
              <p className="text-spotify-gray">
                Add some songs to your library or wait for recommendations
              </p>
            </div>
          )}
        </div>

        {/* Your Playlists */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-white">Your playlists</h2>
            <button className="text-spotify-gray hover:text-white text-sm font-medium">
              Show all
            </button>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {/* Placeholder for playlists */}
            <div className="bg-spotify-light-dark rounded-xl p-4">
              <div className="w-full h-32 bg-spotify-dark rounded-lg mb-3 flex items-center justify-center">
                <i className="fas fa-music text-3xl text-spotify-gray"></i>
              </div>
              <h3 className="text-white font-medium">Liked Songs</h3>
              <p className="text-spotify-gray text-sm">
                Playlist • {likedCount} songs
              </p>
            </div>

            <div className="bg-spotify-light-dark rounded-xl p-4">
              <div className="w-full h-32 bg-spotify-green/20 rounded-lg mb-3 flex items-center justify-center">
                <i className="fas fa-plus text-3xl text-spotify-green"></i>
              </div>
              <h3 className="text-white font-medium">Create Playlist</h3>
              <p className="text-spotify-gray text-sm">Click to add new</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
