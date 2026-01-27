import React, { useState } from "react";
import { mockSongs, mockPlaylists } from "../utils/data";
import SongCard from "../components/SongCard";

interface LibraryPageProps {
  playingSongId: string | null;
  isPlaying: boolean;
  onPlaySong: (songId: string) => void;
  onToggleLike: (songId: string) => void;
}

const LibraryPage: React.FC<LibraryPageProps> = ({
  playingSongId,
  isPlaying,
  onPlaySong,
  onToggleLike,
}) => {
  const [activeTab, setActiveTab] = useState<
    "playlists" | "artists" | "albums" | "liked"
  >("playlists");
  const [sortBy, setSortBy] = useState<"recent" | "alphabetical" | "artist">(
    "recent"
  );

  const likedSongs = mockSongs.filter((song) => song.isLiked);

  return (
    <div className="min-h-screen pb-24">
      {/* Header */}
      <div className="sticky top-0 z-30 bg-spotify-dark/90 backdrop-blur-md px-4 py-4">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-2xl font-bold text-white">Your Library</h1>
            <p className="text-spotify-gray">Your personal music collection</p>
          </div>
          <div className="flex items-center">
            <button className="w-10 h-10 rounded-full bg-spotify-light-dark flex items-center justify-center mr-3">
              <i className="fas fa-search text-spotify-gray"></i>
            </button>
            <button className="w-10 h-10 rounded-full bg-spotify-light-dark flex items-center justify-center">
              <i className="fas fa-plus text-spotify-gray"></i>
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex space-x-2 mb-4 overflow-x-auto pb-2">
          {[
            { id: "playlists", label: "Playlists", icon: "fa-list" },
            { id: "artists", label: "Artists", icon: "fa-user" },
            { id: "albums", label: "Albums", icon: "fa-compact-disc" },
            { id: "liked", label: "Liked Songs", icon: "fa-heart" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex-shrink-0 px-4 py-2 rounded-full transition-colors flex items-center ${
                activeTab === tab.id
                  ? "bg-spotify-green text-white"
                  : "bg-spotify-light-dark text-white hover:bg-spotify-light-gray"
              }`}
            >
              <i className={`fas ${tab.icon} mr-2`}></i>
              {tab.label}
            </button>
          ))}
        </div>

        {/* Sort Options */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex space-x-2">
            {["recent", "alphabetical", "artist"].map((sort) => (
              <button
                key={sort}
                onClick={() => setSortBy(sort as any)}
                className={`px-3 py-1 rounded-full text-sm ${
                  sortBy === sort
                    ? "bg-white text-spotify-dark"
                    : "bg-spotify-light-dark text-spotify-gray hover:text-white"
                }`}
              >
                {sort.charAt(0).toUpperCase() + sort.slice(1)}
              </button>
            ))}
          </div>
          <button className="text-spotify-gray hover:text-white">
            <i className="fas fa-filter"></i>
          </button>
        </div>
      </div>

      <div className="px-4">
        {activeTab === "playlists" && (
          <div>
            <div className="mb-6">
              <div className="h-40 rounded-2xl overflow-hidden relative mb-4 gradient-bg">
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <h3 className="text-2xl font-bold text-white mb-2">
                      Create your first playlist
                    </h3>
                    <p className="text-spotify-gray mb-4">
                      It's easy, we'll help you
                    </p>
                    <button className="px-6 py-2 bg-white text-spotify-dark font-bold rounded-full">
                      Create playlist
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {mockPlaylists.map((playlist) => (
                <div
                  key={playlist.id}
                  className="bg-spotify-light-dark rounded-2xl p-4 hover:bg-spotify-light-gray transition-colors cursor-pointer"
                >
                  <div className="w-full h-32 rounded-xl overflow-hidden mb-3">
                    <img
                      src={playlist.coverUrl}
                      alt={playlist.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <h4 className="text-white font-bold truncate">
                    {playlist.name}
                  </h4>
                  <p className="text-spotify-gray text-sm truncate">
                    {playlist.songCount} songs
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === "liked" && (
          <div>
            {/* Liked Songs Header */}
            <div className="h-48 rounded-2xl overflow-hidden relative mb-6 gradient-bg flex items-center justify-center">
              <div className="text-center">
                <div className="w-16 h-16 rounded-full bg-spotify-green flex items-center justify-center mx-auto mb-4">
                  <i className="fas fa-heart text-white text-2xl"></i>
                </div>
                <h3 className="text-3xl font-bold text-white mb-2">
                  Liked Songs
                </h3>
                <p className="text-spotify-gray">{likedSongs.length} songs</p>
              </div>
            </div>

            {/* Liked Songs List */}
            <div className="bg-spotify-light-dark rounded-2xl overflow-hidden">
              {likedSongs.map((song) => (
                <SongCard
                  key={song.id}
                  song={song}
                  isPlaying={playingSongId === song.id && isPlaying}
                  onPlay={() => onPlaySong(song.id)}
                  onToggleLike={onToggleLike}
                />
              ))}
            </div>
          </div>
        )}

        {activeTab === "artists" && (
          <div className="text-center py-10">
            <i className="fas fa-user-friends text-4xl text-spotify-gray mb-4"></i>
            <h3 className="text-white text-lg mb-2">
              Follow your first artist
            </h3>
            <p className="text-spotify-gray mb-6">
              Follow artists you love to get their latest music
            </p>
            <button className="px-6 py-2 bg-spotify-green text-white font-bold rounded-full">
              Browse artists
            </button>
          </div>
        )}

        {activeTab === "albums" && (
          <div className="text-center py-10">
            <i className="fas fa-compact-disc text-4xl text-spotify-gray mb-4"></i>
            <h3 className="text-white text-lg mb-2">Save your first album</h3>
            <p className="text-spotify-gray mb-6">
              Save albums to listen to later
            </p>
            <button className="px-6 py-2 bg-spotify-green text-white font-bold rounded-full">
              Browse albums
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default LibraryPage;
