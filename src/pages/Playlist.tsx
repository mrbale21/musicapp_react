// import React from "react";
// import PlaylistCard from "../components/PlaylistCard";
// import SongCard from "../components/SongCard";

// interface PlaylistPageProps {
//   playingSongId: string | null;
//   isPlaying: boolean;
//   onPlaySong: (songId: string) => void;
//   onToggleLike: (songId: string) => void;
// }

// const PlaylistPage: React.FC<PlaylistPageProps> = ({
//   playingSongId,
//   isPlaying,
//   onPlaySong,
//   onToggleLike,
// }) => {

//   return (
//     <div className="min-h-screen pb-24">
//       {/* Header */}
//       <div className="sticky top-0 z-30 bg-spotify-dark/90 backdrop-blur-md px-4 py-4">
//         <h1 className="text-2xl font-bold text-white mb-2">Playlists</h1>
//         <p className="text-spotify-gray">Collections of songs for every mood</p>
//       </div>

//       <div className="px-4">
//         {/* Featured Playlists */}
//         <div className="mb-8">
//           <h2 className="text-xl font-bold text-white mb-4">
//             Featured playlists
//           </h2>
//           <div className="grid grid-cols-1 gap-4">
//             {featuredPlaylists.map((playlist) => (
//               <div
//                 key={playlist.id}
//                 className="relative h-48 rounded-2xl overflow-hidden group"
//               >
//                 <img
//                   src={playlist.coverUrl}
//                   alt={playlist.name}
//                   className="w-full h-full object-cover"
//                 />
//                 <div className="absolute inset-0 bg-linear-to-t from-black/80 to-transparent flex flex-col justify-end p-6">
//                   <h3 className="text-2xl font-bold text-white mb-2">
//                     {playlist.name}
//                   </h3>
//                   <p className="text-spotify-gray mb-3">
//                     {playlist.description}
//                   </p>
//                   <div className="flex items-center">
//                     <button className="w-12 h-12 bg-spotify-green rounded-full flex items-center justify-center mr-3 hover:scale-105 transition-transform">
//                       <i className="fas fa-play text-black"></i>
//                     </button>
//                     <span className="text-white">
//                       {playlist.songCount} songs
//                     </span>
//                   </div>
//                 </div>
//               </div>
//             ))}
//           </div>
//         </div>

//         {/* Your Playlists */}
//         <div className="mb-8">
//           <div className="flex items-center justify-between mb-4">
//             <h2 className="text-xl font-bold text-white">Your playlists</h2>
//             <button className="text-spotify-gray hover:text-white text-sm font-medium">
//               Create new
//             </button>
//           </div>
//           <div className="grid grid-cols-2 gap-4">
//             {recentPlaylists.map((playlist) => (
//               <PlaylistCard
//                 key={playlist.id}
//                 playlist={playlist}
//                 onClick={() => console.log("Open playlist:", playlist.id)}
//               />
//             ))}
//           </div>
//         </div>

//         {/* Recently Played Songs */}
//         <div>
//           <h2 className="text-xl font-bold text-white mb-4">
//             Recently played songs
//           </h2>
//           <div className="bg-spotify-light-dark rounded-2xl overflow-hidden">
//             {mockSongs.slice(0, 4).map((song) => (
//               <SongCard
//                 key={song.id}
//                 song={song}
//                 isPlaying={playingSongId === song.id && isPlaying}
//                 onPlay={() => onPlaySong(song.id)}
//                 onToggleLike={onToggleLike}
//               />
//             ))}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default PlaylistPage;
