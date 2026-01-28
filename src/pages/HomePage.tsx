// pages/HomePage.tsx - Extract song dari RecommendationItem
import { useState, useEffect, useCallback, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import useApi from "../apis/api";
import Header from "../components/Header";
import { TrendingUp, Users, Sparkles, Brain } from "lucide-react";
import LoadingSpinner from "../components/common/LoadingSpinner";
import type { Song, RecommendationItem } from "../apis/models/models"; // Import juga RecommendationItem
import { songResourceApiYoutube, songsUseApi } from "../apis/endpoints/song";
import { useMusicPlayer } from "../hooks/useMusicPlayer";
import { useSongInteractions } from "../hooks/useSongsInteractions";
import AllSongsCard from "../components/AllSongCard";
import PopularCard from "../components/PopularCard";
import {
  recommendationContentApi,
  recommendationPopularApi,
} from "../apis/endpoints/recommendation";
import { usePlayer } from "../context/PlayerContext";
import SearchComponent from "../components/Search";

const HomePage = () => {
  const navigate = useNavigate();
  const player = usePlayer();

  // State
  const [songs, setSongs] = useState<Song[]>([]);
  const [loading, setLoading] = useState(true);
  const [userHistorySongs, setUserHistorySongs] = useState<Song[]>([]);
  const [contentBasedRecommendations, setContentBasedRecommendations] =
    useState<RecommendationItem[]>([]);
  const songsRef = useRef<Song[]>([]);

  // APIs
  const songApi = useApi({ api: songsUseApi });
  const popularSongsApi = useApi({ api: recommendationPopularApi });
  const songsSourceApi = useApi({ api: songResourceApiYoutube });
  const contentRecommendApi = useApi({ api: recommendationContentApi });

  // Custom Hooks
  const { play, isCurrentPlaying } = useMusicPlayer();
  const { handleLike, handlePlay, isLikeLoading, isPlayLoading, cleanup } =
    useSongInteractions({
      onUpdateSong: (songId, updates) => {
        setSongs((prev) =>
          prev.map((song) =>
            song.id === songId ? { ...song, ...updates } : song,
          ),
        );
      },
    });

  useEffect(() => {
    return () => {
      cleanup();
    };
  }, [cleanup]);

  // Update ref setiap kali songs berubah
  useEffect(() => {
    songsRef.current = songs;
  }, [songs]);

  // **Function helper untuk extract songs dari recommendations**
  // const extractSongsFromRecommendations = useCallback(
  //   (recommendations: RecommendationItem[]): Song[] => {
  //     return recommendations.map((rec) => rec.song);
  //   },
  //   [],
  // );

  // **Function helper untuk filter songs with YouTube ID dari recommendations**
  const getSongsWithYouTubeFromRecommendations = useCallback(
    (recommendations: RecommendationItem[]): Song[] => {
      return recommendations
        .filter((rec) => rec.song.youtube_id)
        .map((rec) => rec.song);
    },
    [],
  );

  // Ambil song history user
  useEffect(() => {
    const userLikedSongs = JSON.parse(
      localStorage.getItem("user_liked_songs") || "[]",
    );
    const userPlayedSongs = JSON.parse(
      localStorage.getItem("user_played_songs") || "[]",
    );

    const historySongs = [...userLikedSongs, ...userPlayedSongs].filter(
      (song, index, self) => index === self.findIndex((s) => s.id === song.id),
    );

    setUserHistorySongs(historySongs);
  }, []);

  // Fetch data - FIXED: Removed API objects from dependencies
  useEffect(() => {
    songApi.process({});
    popularSongsApi.process({});
  }, []); // Only run once on mount

  // Fetch content-based recommendations when user history changes
  useEffect(() => {
    // Jika user punya history, ambil content-based recommendations
    if (userHistorySongs.length > 0) {
      const lastPlayedSong = userHistorySongs[0];
      contentRecommendApi.process({ song_id: lastPlayedSong.id });
    }
  }, [userHistorySongs]); // Only depend on userHistorySongs

  // Fetch content-based recommendations when popular songs are loaded
  useEffect(() => {
    // Jika tidak ada history dan popular songs sudah dimuat, gunakan lagu popular pertama sebagai seed
    if (
      userHistorySongs.length === 0 &&
      popularSongsApi.data?.data?.songs?.[0]
    ) {
      contentRecommendApi.process({
        song_id: popularSongsApi.data.data.songs[0].id,
      });
    }
  }, [popularSongsApi.data, userHistorySongs]); // Only depend on data, not the API object

  // Update songs state
  useEffect(() => {
    if (songApi.data?.data.songs) {
      setSongs(songApi.data.data.songs);
    }
  }, [songApi.data]);

  // **Update content-based recommendations**
  useEffect(() => {
    if (contentRecommendApi.data?.data?.recommendations) {
      setContentBasedRecommendations(
        contentRecommendApi.data.data.recommendations,
      );
      if (import.meta.env.DEV) {
        console.log(
          `📊 Got ${contentRecommendApi.data.data.recommendations.length} recommendations`,
        );
      }
    }
  }, [contentRecommendApi.data]);

  // **PERBAIKAN: Isi queue dari content-based recommendations**
  useEffect(() => {
    // Prioritaskan content-based recommendations
    if (contentBasedRecommendations.length > 0 && player.queue.length === 0) {
      const songsWithYouTube = getSongsWithYouTubeFromRecommendations(
        contentBasedRecommendations.slice(0, 15),
      );

      if (songsWithYouTube.length > 0) {
        if (import.meta.env.DEV) {
          console.log(
            `🎵 Auto-filling queue with ${songsWithYouTube.length} content-based recommendations`,
          );
        }
        player.addMultipleToQueue(songsWithYouTube);
        return;
      }
    }

    // Fallback ke popular songs jika tidak ada recommendations
    if (popularSongsApi.data?.data?.songs && player.queue.length === 0) {
      const popularSongs = popularSongsApi.data.data.songs.slice(0, 10);
      const songsWithYouTube = popularSongs.filter((song) => song.youtube_id);

      if (songsWithYouTube.length > 0) {
        if (import.meta.env.DEV) {
          console.log(
            `🎵 Fallback: Filling queue with ${songsWithYouTube.length} popular songs`,
          );
        }
        player.addMultipleToQueue(songsWithYouTube);
      }
    }
  }, [
    contentBasedRecommendations,
    popularSongsApi.data,
    player,
    getSongsWithYouTubeFromRecommendations,
  ]);

  // Update loading state
  useEffect(() => {
    if (!songApi.isLoading && !popularSongsApi.isLoading) {
      setLoading(false);
    }
  }, [songApi.isLoading, popularSongsApi.isLoading]);

  const fetchYouTubeIdForSong = useCallback(async (song: Song) => {
    if (song.youtube_id) return song;

    if (import.meta.env.DEV) {
      console.log(
        `Fetching YouTube ID for song: ${song.title} (ID: ${song.id})`,
      );
    }

    try {
      songsSourceApi.process({ id: song.id });

      await new Promise((resolve) => {
        const checkInterval = setInterval(() => {
          if (!songsSourceApi.isLoading) {
            clearInterval(checkInterval);
            resolve(null);
          }
        }, 100);
      });

      if (songsSourceApi.data?.data?.video_id) {
        const updatedSong = {
          ...song,
          youtube_id: songsSourceApi.data.data.video_id,
        };

        setSongs((prev) =>
          prev.map((s) => (s.id === song.id ? updatedSong : s)),
        );

        if (import.meta.env.DEV) {
          console.log(
            `Found YouTube ID: ${songsSourceApi.data.data.video_id} for ${song.title}`,
          );
        }
        return updatedSong;
      } else {
        if (import.meta.env.DEV) {
          console.warn(`No video_id found for ${song.title}`);
        }
        return null;
      }
    } catch (error) {
      if (import.meta.env.DEV) {
        console.error(`Error fetching YouTube ID for ${song.title}:`, error);
      }
      return null;
    }
  }, []);

  const handlePlayOnly = useCallback(
    async (song: Song, e?: React.MouseEvent) => {
      if (e) e.stopPropagation();

      // Simpan ke history
      const playedSongs = JSON.parse(
        localStorage.getItem("user_played_songs") || "[]",
      );
      playedSongs.unshift(song);
      localStorage.setItem(
        "user_played_songs",
        JSON.stringify(playedSongs.slice(0, 50)),
      );

      if (song.youtube_id) {
        play(song);
        handlePlay(song).catch(console.error);
      } else {
        const updatedSong = await fetchYouTubeIdForSong(song);
        if (updatedSong?.youtube_id) {
          play(updatedSong);
          handlePlay(updatedSong).catch(console.error);
        }
      }
    },
    [play, handlePlay, fetchYouTubeIdForSong],
  );

  // **PERBAIKAN: Refresh recommendations**
  // const handleRefreshRecommendations = useCallback(() => {
  //   if (player.currentSong) {
  //     if (import.meta.env.DEV) {
  //       console.log(
  //         `🔄 Refreshing recommendations based on: ${player.currentSong.title}`,
  //       );
  //     }
  //     contentRecommendApi.process({ song_id: player.currentSong.id });

  //     setTimeout(() => {
  //       if (contentBasedRecommendations.length > 0) {
  //         const songsWithYouTube = getSongsWithYouTubeFromRecommendations(
  //           contentBasedRecommendations.slice(0, 15),
  //         );

  //         if (songsWithYouTube.length > 0) {
  //           player.clearQueue();
  //           player.addMultipleToQueue(songsWithYouTube);
  //           toast.success(
  //             `Refreshed queue with ${songsWithYouTube.length} new recommendations!`,
  //           );
  //         }
  //       }
  //     }, 1000);
  //   } else {
  //     toast.info("Play a song first to get recommendations!");
  //   }
  // }, [
  //   player.currentSong,
  //   contentRecommendApi,
  //   contentBasedRecommendations,
  //   player,
  //   getSongsWithYouTubeFromRecommendations,
  // ]);

  const handleAddToQueue = useCallback(
    (song: Song) => {
      player.addToQueue(song);
      toast.success(`"${song.title}" added to queue!`);
    },
    [player],
  );

  // **PERBAIKAN: Play content-based recommendations**
  // const handlePlayContentBased = useCallback(() => {
  //   if (contentBasedRecommendations.length > 0) {
  //     const songsWithYouTube = getSongsWithYouTubeFromRecommendations(
  //       contentBasedRecommendations.slice(0, 20),
  //     );

  //     if (songsWithYouTube.length === 0) {
  //       toast.warning("No recommended songs with YouTube ID available");
  //       return;
  //     }

  //     player.clearQueue();
  //     player.addMultipleToQueue(songsWithYouTube);

  //     if (songsWithYouTube[0]) {
  //       player.playSong(songsWithYouTube[0]);
  //     }

  //     toast.success(
  //       `Playing ${songsWithYouTube.length} content-based recommendations!`,
  //     );
  //   } else {
  //     toast.info("No recommendations available yet. Play some songs first!");
  //   }
  // }, [
  //   contentBasedRecommendations,
  //   player,
  //   getSongsWithYouTubeFromRecommendations,
  // ]);

  // **PERBAIKAN: Shuffle content-based recommendations**
  // const handleShuffleContentBased = useCallback(() => {
  //   if (contentBasedRecommendations.length > 0) {
  //     const songsWithYouTube = getSongsWithYouTubeFromRecommendations(
  //       contentBasedRecommendations.slice(0, 30),
  //     );

  //     if (songsWithYouTube.length === 0) {
  //       toast.warning("No recommended songs with YouTube ID available");
  //       return;
  //     }

  //     player.clearQueue();
  //     player.addMultipleToQueue(songsWithYouTube);
  //     player.shuffleQueue();

  //     if (songsWithYouTube[0]) {
  //       player.playSong(songsWithYouTube[0]);
  //     }

  //     toast.success(
  //       `Shuffled ${songsWithYouTube.length} content-based recommendations!`,
  //     );
  //   } else {
  //     toast.info("No recommendations available yet. Play some songs first!");
  //   }
  // }, [
  //   contentBasedRecommendations,
  //   player,
  //   getSongsWithYouTubeFromRecommendations,
  // ]);

  // const handlePlayAll = useCallback(() => {
  //   const songsWithYouTube = songs
  //     .filter((song) => song.youtube_id)
  //     .slice(0, 20);

  //   if (songsWithYouTube.length === 0) {
  //     toast.warning("No songs with YouTube ID available");
  //     return;
  //   }

  //   player.clearQueue();
  //   player.addMultipleToQueue(songsWithYouTube);

  //   if (songsWithYouTube[0]) {
  //     player.play(songsWithYouTube[0]);
  //   }

  //   toast.success(`Added ${songsWithYouTube.length} songs to queue!`);
  // }, [songs, player]);

  // const handleShuffleAll = useCallback(() => {
  //   const songsWithYouTube = songs
  //     .filter((song) => song.youtube_id)
  //     .slice(0, 30);

  //   if (songsWithYouTube.length === 0) {
  //     toast.warning("No songs with YouTube ID available");
  //     return;
  //   }

  //   player.clearQueue();
  //   player.addMultipleToQueue(songsWithYouTube);
  //   player.shuffleQueue();

  //   if (songsWithYouTube[0]) {
  //     player.play(songsWithYouTube[0]);
  //   }

  //   toast.success(`Shuffled ${songsWithYouTube.length} songs!`);
  // }, [songs, player]);

  useEffect(() => {
    const handleFirstInteraction = () => {
      if (import.meta.env.DEV) {
        console.log("User interaction detected - autoplay enabled");
      }
    };

    window.addEventListener("click", handleFirstInteraction, { once: true });
    // No cleanup needed with 'once: true'
  }, []);

  const handleCardClick = useCallback(
    (song: Song) => {
      navigate(`/song/${song.id}`);
    },
    [navigate],
  );

  const handleLikeSong = useCallback(
    async (song: Song) => {
      await handleLike(song);

      const likedSongs = JSON.parse(
        localStorage.getItem("user_liked_songs") || "[]",
      );
      likedSongs.unshift(song);
      localStorage.setItem(
        "user_liked_songs",
        JSON.stringify(likedSongs.slice(0, 50)),
      );
    },
    [handleLike],
  );

  const handleSongContextMenu = useCallback(
    (song: Song, e: React.MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();

      const action = prompt(
        `Choose action for "${song.title}":\n1. Play now\n2. Add to queue\n3. Play next\n4. Get similar songs`,
        "1",
      );

      switch (action) {
        case "1":
          handlePlayOnly(song);
          break;
        case "2":
          handleAddToQueue(song);
          break;
        case "3":
          player.playNext(song);
          toast.success(`"${song.title}" will play next!`);
          break;
        case "4":
          contentRecommendApi.process({ song_id: song.id });
          toast.info(`Getting recommendations similar to "${song.title}"...`);
          break;
        default:
          break;
      }
    },
    [handlePlayOnly, handleAddToQueue, player, contentRecommendApi],
  );

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  const songsResult = songs;
  const popularSpongs = popularSongsApi.data?.data.songs ?? [];
  // const contentBasedSongs = extractSongsFromRecommendations(
  //   contentBasedRecommendations,
  // );

  const popular = popularSpongs.length > 0 ? popularSpongs.slice(0, 4) : [];
  // const contentBased =
  //   contentBasedSongs.length > 0 ? contentBasedSongs.slice(0, 8) : [];
  const allSongs =
    songsResult.length > 0 ? songsResult.slice(0, 8) : songs.slice(0, 8);

  return (
    <div className="pb-48 bg-gradient-to-b from-gray-900 to-black">
      <Header title="Home" />

      <div className="p-3">
        <SearchComponent
          onSongClick={(song) => {
            navigate(`/song/${song.id}`);
          }}
        />
      </div>

      <div className="p-3 space-y-6">
        {/* Popular Section */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-purple-400" />{" "}
              {/* Ganti warna */}
              <h2 className="text-xl font-bold text-white">Popular Now</h2>
            </div>
            <button
              onClick={() => navigate("/popular")}
              className="text-sm bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 px-4 py-2 rounded-xl text-white font-medium transition-all duration-200"
            >
              Lihat Semua
            </button>
          </div>

          {popular.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-400">Tidak ada lagu tersedia</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-4">
              {popular.map((song) => (
                <div
                  key={song.id}
                  onClick={() => handleCardClick(song)}
                  onContextMenu={(e) => handleSongContextMenu(song, e)}
                  className="cursor-pointer group"
                >
                  <PopularCard
                    song={song}
                    isPlaying={isCurrentPlaying(song.id)}
                    onPlay={(song) => handlePlayOnly(song)}
                    onLike={() => handleLikeSong(song)}
                    likeLoading={isLikeLoading(song.id)}
                    playLoading={isPlayLoading(song.id)}
                    showQueueActions
                    onAddToQueue={() => handleAddToQueue(song)}
                    onPlayNext={() => player.playNext(song)}
                  />
                </div>
              ))}
            </div>
          )}
        </section>

        {/* All Songs Section */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Brain className="w-5 h-5 text-purple-400" /> {/* Ganti warna */}
              <h2 className="text-lg font-bold text-white">Rekomendasi</h2>
            </div>
          </div>

          {allSongs.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-400">Tidak ada lagu tersedia</p>
            </div>
          ) : (
            <div className="bg-gray-900/50 backdrop-blur-sm rounded-2xl border border-gray-800 overflow-hidden">
              {" "}
              {/* Ganti warna */}
              {allSongs.map((song, index) => (
                <div
                  key={song.id}
                  onClick={() => handleCardClick(song)}
                  onContextMenu={(e) => handleSongContextMenu(song, e)}
                  className="cursor-pointer hover:bg-gray-800/30 transition-colors"
                >
                  <AllSongsCard
                    song={song}
                    index={index + 1}
                    showIndex
                    isPlaying={isCurrentPlaying(song.id)}
                    onPlay={(song) => handlePlayOnly(song)}
                    onLike={handleLikeSong}
                    likeLoading={isLikeLoading(song.id)}
                    playLoading={isPlayLoading(song.id)}
                    showQueueActions
                    onAddToQueue={() => handleAddToQueue(song)}
                    onPlayNext={() => player.playNext(song)}
                  />
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Quick Access Section */}
        <section>
          <h2 className="text-xl font-bold text-white mb-4">Akses Cepat</h2>
          <div className="space-y-3">
            <button
              onClick={() => navigate("/collaborative")}
              className="w-full bg-gradient-to-r from-purple-900/30 to-pink-900/30 hover:from-purple-800/40 hover:to-pink-800/40 rounded-xl p-4 flex items-center gap-4 transition-all duration-200 border border-purple-500/20"
            >
              <div className="w-12 h-12 bg-gradient-to-br from-purple-600 to-pink-500 rounded-xl flex items-center justify-center">
                {" "}
                {/* Ganti warna */}
                <Users className="w-6 h-6 text-white" />
              </div>
              <div className="text-left flex-1">
                <h3 className="font-semibold text-white">
                  Rekomendasi Kolaboratif
                </h3>
                <p className="text-sm text-gray-400">
                  Berdasarkan pengguna serupa
                </p>
              </div>
            </button>

            <button
              onClick={() => navigate("/hybrid")}
              className="w-full bg-gradient-to-r from-purple-900/30 to-pink-900/30 hover:from-purple-800/40 hover:to-pink-800/40 rounded-xl p-4 flex items-center gap-4 transition-all duration-200 border border-purple-500/20"
            >
              <div className="w-12 h-12 bg-gradient-to-br from-purple-600 to-pink-500 rounded-xl flex items-center justify-center">
                {" "}
                {/* Ganti warna */}
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <div className="text-left flex-1">
                <h3 className="font-semibold text-white">Hybrid Mix</h3>
                <p className="text-sm text-gray-400">Rekomendasi berbasis AI</p>
              </div>
            </button>
          </div>
        </section>
      </div>
    </div>
  );
};

export default HomePage;
