// components/SearchComponent.tsx
import React, { useState, useCallback, useEffect, useRef } from "react";
import { Search, X, Music, Clock, Play, Heart } from "lucide-react";
import { toast } from "react-toastify";
import { useMusicPlayer } from "../hooks/useMusicPlayer";
import { useSongInteractions } from "../hooks/useSongsInteractions";
import useApi from "../apis/api";
import type { Song } from "../apis/models/models";
import LoadingSpinner from "./common/LoadingSpinner";
import { searchSongsApi } from "../apis/endpoints/serach";
import { songResourceApiYoutube } from "../apis/endpoints/song";

interface SearchComponentProps {
  onSongClick?: (song: Song) => void;
}

const SearchComponent: React.FC<SearchComponentProps> = ({ onSongClick }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<Song[]>([]);
  const lastQueryRef = useRef<string>("");
  const [isSearching, setIsSearching] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  //   const [popularSearches] = useState([
  //     "Lagu Indonesia",
  //     "Pop Terbaru",
  //     "Rock Klasik",
  //     "Jazz Relax",
  //     "Hip Hop",
  //     "Indie",
  //   ]);
  const searchContainerRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // API untuk search
  const searchApi = useApi({
    api: searchSongsApi,
    onSuccess: (res) => {
      setSearchResults(Array.isArray(res?.data) ? res.data : []);

      setIsSearching(false);
    },

    onFail: (error) => {
      console.error("Search error:", error);
      toast.error("Gagal melakukan pencarian");
      setSearchResults([]);
      setIsSearching(false);
    },
  });

  // Custom Hooks
  const { play } = useMusicPlayer();
  const { handleLike, handlePlay, isLikeLoading, isPlayLoading } =
    useSongInteractions({
      onUpdateSong: (songId, updates) => {
        setSearchResults((prev) =>
          prev.map((song) =>
            song.id === songId ? { ...song, ...updates } : song,
          ),
        );
      },
    });

  // Load recent searches from localStorage
  useEffect(() => {
    const saved = localStorage.getItem("recent_searches");
    if (saved) {
      try {
        setRecentSearches(JSON.parse(saved));
      } catch (e) {
        console.error("Error loading recent searches:", e);
      }
    }
  }, []);

  // Save recent searches to localStorage
  useEffect(() => {
    if (recentSearches.length > 0) {
      localStorage.setItem("recent_searches", JSON.stringify(recentSearches));
    }
  }, [recentSearches]);

  // Close search results when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        searchContainerRef.current &&
        !searchContainerRef.current.contains(event.target as Node) &&
        showResults
      ) {
        setShowResults(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showResults]);

  // Handle search
  const handleSearch = useCallback(
    async (query: string) => {
      const q = query.trim();
      if (!q) return;

      // 🔒 STOP kalau query sama
      if (lastQueryRef.current === q) return;
      lastQueryRef.current = q;

      setIsSearching(true);
      setShowResults(true);

      // update recent searches (AMAN)
      setRecentSearches((prev) =>
        [q, ...prev.filter((s) => s !== q)].slice(0, 5),
      );

      await searchApi.process({ q });
    },
    [searchApi],
  );

  useEffect(() => {
    if (!searchQuery.trim()) return;

    const t = setTimeout(() => {
      handleSearch(searchQuery);
    }, 400);

    return () => clearTimeout(t);
  }, [searchQuery, handleSearch]);

  // Handle input change with debounce
  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      setSearchQuery(value);

      if (!value.trim()) {
        setSearchResults([]);
        setShowResults(false);
        lastQueryRef.current = ""; // reset guard
      } else {
        setShowResults(true);
      }
    },
    [],
  );

  // Handle clear search
  const handleClearSearch = useCallback(() => {
    setSearchQuery("");
    setSearchResults([]);
    setShowResults(false);
    searchInputRef.current?.focus();
  }, []);

  // Handle song click
  const handleSongClick = useCallback(
    (song: Song) => {
      if (onSongClick) {
        onSongClick(song);
      }
      setShowResults(false);
    },
    [onSongClick],
  );

  // Handle play song
  const handlePlaySong = useCallback(
    async (song: Song, e?: React.MouseEvent) => {
      if (e) e.stopPropagation();

      try {
        if (song.youtube_id) {
          play(song);
          await handlePlay(song);
        } else {
          toast.info("Mencari sumber audio...");
          const result = await songResourceApiYoutube({ id: song.id });
          if (result.data?.video_id) {
            const updatedSong = { ...song, youtube_id: result.data.video_id };
            play(updatedSong);
            await handlePlay(updatedSong);
          } else {
            toast.error("Sumber audio tidak ditemukan untuk lagu ini");
          }
        }
      } catch (error) {
        console.error("Play error:", error);
        toast.error("Gagal memutar lagu");
      }
    },
    [play, handlePlay],
  );

  // Handle like song
  const handleLikeSong = useCallback(
    async (song: Song, e?: React.MouseEvent) => {
      if (e) e.stopPropagation();
      await handleLike(song);
    },
    [handleLike],
  );

  // Handle recent search click
  const handleRecentSearchClick = useCallback(
    (term: string) => {
      setSearchQuery(term);
      searchInputRef.current?.focus();
      setTimeout(() => handleSearch(term), 100);
    },
    [handleSearch],
  );

  // Handle popular search click
  //   const handlePopularSearchClick = useCallback(
  //     (term: string) => {
  //       setSearchQuery(term);
  //       searchInputRef.current?.focus();
  //       setTimeout(() => handleSearch(), 100);
  //     },
  //     [handleSearch],
  //   );

  return (
    <div className="w-full relative" ref={searchContainerRef}>
      {/* Search Input */}
      <div className="relative group">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search className="w-5 h-5 text-gray-400" />
        </div>
        <input
          ref={searchInputRef}
          type="text"
          value={searchQuery}
          onChange={handleInputChange}
          onFocus={() => {
            if (searchQuery.trim() || recentSearches.length > 0) {
              setShowResults(true);
            }
          }}
          placeholder="Cari lagu, artis, atau album..."
          className="w-full pl-10 pr-10 py-3 bg-gray-900/60 border border-gray-800 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 text-sm"
        />
        {searchQuery && (
          <button
            onClick={handleClearSearch}
            className="absolute inset-y-0 right-0 pr-3 flex items-center"
          >
            <X className="w-5 h-5 text-gray-400 hover:text-gray-300 transition-colors" />
          </button>
        )}
      </div>

      {/* Search Results Dropdown */}
      {showResults && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-black/90 backdrop-blur-xl rounded-xl border border-gray-800 shadow-2xl shadow-black/50 z-50 max-h-[70vh] overflow-y-auto">
          {isSearching ? (
            // Loading State
            <div className="p-4 flex justify-center">
              <LoadingSpinner />
            </div>
          ) : searchQuery.trim() && searchResults.length > 0 ? (
            // Search Results
            <div className="p-2">
              <div className="px-3 py-2">
                <p className="text-sm font-medium text-gray-400">
                  Hasil pencarian untuk "{searchQuery}"
                </p>
              </div>

              {searchResults.map((song) => (
                <div
                  key={song.id}
                  onClick={() => handleSongClick(song)}
                  className="flex items-center gap-3 p-3 hover:bg-gray-800/50 rounded-lg cursor-pointer transition-colors group"
                >
                  {/* Album/Thumbnail */}
                  <div className="relative flex-shrink-0">
                    <div className="w-12 h-12 bg-gradient-to-br from-purple-600 to-pink-500 rounded-lg overflow-hidden">
                      <img
                        src={song.image_url || "/placeholder-album.jpg"}
                        alt={song.title}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.src = "/placeholder-album.jpg";
                        }}
                      />
                    </div>
                    <button
                      onClick={(e) => handlePlaySong(song, e)}
                      className="absolute inset-0 bg-black/60 rounded-lg flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <Play className="w-5 h-5 text-white" fill="white" />
                    </button>
                  </div>

                  {/* Song Info */}
                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm font-medium text-white truncate">
                      {song.title}
                    </h3>
                    <p className="text-xs text-gray-400 truncate">
                      {song.artist || "Unknown Artist"}
                    </p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-xs px-2 py-0.5 bg-gray-800 rounded">
                        {song.genre || "Unknown"}
                      </span>
                      {song.album && (
                        <span className="text-xs text-gray-500">
                          {song.album}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-1">
                    <button
                      onClick={(e) => handleLikeSong(song, e)}
                      disabled={isLikeLoading(song.id)}
                      className="p-2 hover:bg-gray-700 rounded-lg transition-colors"
                    >
                      <Heart
                        className={`w-4 h-4 ${song.is_liked ? "text-pink-500 fill-pink-500" : "text-gray-400"}`}
                      />
                    </button>
                    <button
                      onClick={(e) => handlePlaySong(song, e)}
                      disabled={isPlayLoading(song.id)}
                      className="p-2 hover:bg-gray-700 rounded-lg transition-colors"
                    >
                      <Play className="w-4 h-4 text-gray-400" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : searchQuery.trim() && searchResults.length === 0 ? (
            // No Results
            <div className="p-6 text-center">
              <Music className="w-12 h-12 text-gray-600 mx-auto mb-3" />
              <p className="text-gray-400 text-sm">Tidak ada hasil ditemukan</p>
              <p className="text-gray-500 text-xs mt-1">
                Coba dengan kata kunci lain
              </p>
            </div>
          ) : (
            // Recent & Popular Searches
            <div className="p-3">
              {/* Recent Searches */}
              {recentSearches.length > 0 && (
                <div className="mb-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Clock className="w-4 h-4 text-gray-400" />
                    <h3 className="text-sm font-medium text-gray-300">
                      Pencarian Terakhir
                    </h3>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {recentSearches.map((term, index) => (
                      <button
                        key={index}
                        onClick={() => handleRecentSearchClick(term)}
                        className="px-3 py-1.5 text-xs bg-gray-800/50 hover:bg-gray-700 rounded-lg text-gray-300 transition-colors"
                      >
                        {term}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Popular Searches */}
              {/* <div>
                <h3 className="text-sm font-medium text-gray-300 mb-2">
                  Pencarian Populer
                </h3>
                <div className="flex flex-wrap gap-2">
                  {popularSearches.map((term, index) => (
                    <button
                      key={index}
                      onClick={() => handlePopularSearchClick(term)}
                      className="px-3 py-1.5 text-xs bg-gradient-to-r from-purple-800/30 to-pink-800/30 hover:from-purple-700/40 hover:to-pink-700/40 rounded-lg text-gray-300 transition-colors border border-purple-500/10"
                    >
                      {term}
                    </button>
                  ))}
                </div>
              </div> */}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default SearchComponent;
