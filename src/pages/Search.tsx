// import React, { useState } from "react";
// import { mockSongs, mockPlaylists } from "../utils/data";
// import SongCard from "../components/SongCard";

// interface SearchPageProps {
//   playingSongId: string | null;
//   isPlaying: boolean;
//   onPlaySong: (songId: string) => void;
//   onToggleLike: (songId: string) => void;
// }

// const SearchPage: React.FC<SearchPageProps> = ({
//   playingSongId,
//   isPlaying,
//   onPlaySong,
//   onToggleLike,
// }) => {
//   const [searchQuery, setSearchQuery] = useState("");
//   const [activeCategory, setActiveCategory] = useState("All");

//   const categories = [
//     "All",
//     "Music",
//     "Podcasts",
//     "Playlists",
//     "Artists",
//     "Albums",
//   ];
//   const genres = [
//     "Pop",
//     "Hip Hop",
//     "Rock",
//     "R&B",
//     "Electronic",
//     "Jazz",
//     "Indie",
//   ];

//   const filteredSongs = mockSongs.filter(
//     (song) =>
//       song.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
//       song.artist.toLowerCase().includes(searchQuery.toLowerCase()) ||
//       song.genre.some((g) =>
//         g.toLowerCase().includes(searchQuery.toLowerCase())
//       )
//   );

//   return (
//     <div className="min-h-screen pb-24">
//       {/* Search Header */}
//       <div className="sticky top-0 z-30 bg-spotify-dark/90 backdrop-blur-md px-4 py-4">
//         <h1 className="text-2xl font-bold text-white mb-4">Search</h1>

//         {/* Search Input */}
//         <div className="relative mb-6">
//           <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
//             <i className="fas fa-search text-spotify-gray"></i>
//           </div>
//           <input
//             type="text"
//             value={searchQuery}
//             onChange={(e) => setSearchQuery(e.target.value)}
//             className="w-full pl-10 pr-3 py-3 bg-spotify-light-dark border border-spotify-light-gray rounded-xl text-white placeholder-spotify-gray focus:outline-none focus:ring-2 focus:ring-spotify-green focus:border-transparent"
//             placeholder="Artists, songs, or podcasts"
//           />
//         </div>

//         {/* Categories */}
//         <div className="flex space-x-3 mb-4 overflow-x-auto pb-2">
//           {categories.map((category) => (
//             <button
//               key={category}
//               onClick={() => setActiveCategory(category)}
//               className={`flex-shrink-0 px-4 py-2 rounded-full transition-colors ${
//                 activeCategory === category
//                   ? "bg-spotify-green text-white"
//                   : "bg-spotify-light-dark text-white hover:bg-spotify-light-gray"
//               }`}
//             >
//               {category}
//             </button>
//           ))}
//         </div>
//       </div>

//       <div className="px-4">
//         {searchQuery ? (
//           /* Search Results */
//           <div>
//             <h2 className="text-xl font-bold text-white mb-4">
//               Search results for "{searchQuery}"
//             </h2>

//             {filteredSongs.length > 0 ? (
//               <div className="bg-spotify-light-dark rounded-2xl overflow-hidden">
//                 {filteredSongs.map((song) => (
//                   <SongCard
//                     key={song.id}
//                     song={song}
//                     isPlaying={playingSongId === song.id && isPlaying}
//                     onPlay={() => onPlaySong(song.id)}
//                     onToggleLike={onToggleLike}
//                   />
//                 ))}
//               </div>
//             ) : (
//               <div className="text-center py-10">
//                 <i className="fas fa-search text-4xl text-spotify-gray mb-4"></i>
//                 <h3 className="text-white text-lg mb-2">No results found</h3>
//                 <p className="text-spotify-gray">
//                   Try searching for something else
//                 </p>
//               </div>
//             )}
//           </div>
//         ) : (
//           /* Browse All */
//           <div>
//             <h2 className="text-xl font-bold text-white mb-4">Browse all</h2>

//             {/* Genres */}
//             <div className="mb-8">
//               <h3 className="text-lg font-bold text-white mb-3">
//                 Genres & Moods
//               </h3>
//               <div className="grid grid-cols-2 gap-3">
//                 {genres.map((genre) => (
//                   <div
//                     key={genre}
//                     className="relative h-24 rounded-xl overflow-hidden group cursor-pointer"
//                     style={{
//                       background: `linear-gradient(135deg, ${getGenreColor(
//                         genre
//                       )}80, ${getGenreColor(genre)}40)`,
//                     }}
//                   >
//                     <div className="absolute inset-0 flex items-center justify-center">
//                       <span className="text-white font-bold text-lg">
//                         {genre}
//                       </span>
//                     </div>
//                     <div className="absolute bottom-2 right-2 w-8 h-8 bg-black/30 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
//                       <i className="fas fa-play text-white text-sm"></i>
//                     </div>
//                   </div>
//                 ))}
//               </div>
//             </div>

//             {/* Popular Playlists */}
//             <div>
//               <div className="flex items-center justify-between mb-3">
//                 <h3 className="text-lg font-bold text-white">
//                   Popular playlists
//                 </h3>
//                 <button className="text-spotify-gray hover:text-white text-sm font-medium">
//                   See all
//                 </button>
//               </div>
//               <div className="grid grid-cols-2 gap-4">
//                 {mockPlaylists.map((playlist) => (
//                   <div
//                     key={playlist.id}
//                     className="bg-spotify-light-dark rounded-2xl p-4 hover:bg-spotify-light-gray transition-colors cursor-pointer"
//                   >
//                     <div className="w-full h-32 rounded-xl overflow-hidden mb-3">
//                       <img
//                         src={playlist.coverUrl}
//                         alt={playlist.name}
//                         className="w-full h-full object-cover"
//                       />
//                     </div>
//                     <h4 className="text-white font-bold truncate">
//                       {playlist.name}
//                     </h4>
//                     <p className="text-spotify-gray text-sm truncate">
//                       {playlist.songCount} songs
//                     </p>
//                   </div>
//                 ))}
//               </div>
//             </div>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// // Helper function to get genre colors
// const getGenreColor = (genre: string): string => {
//   const colors: Record<string, string> = {
//     Pop: "#FF6B8B",
//     "Hip Hop": "#1DB954",
//     Rock: "#FF8E53",
//     "R&B": "#8E44EE",
//     Electronic: "#3498DB",
//     Jazz: "#E74C3C",
//     Indie: "#2ECC71",
//   };
//   return colors[genre] || "#9B59B6";
// };

// export default SearchPage;
