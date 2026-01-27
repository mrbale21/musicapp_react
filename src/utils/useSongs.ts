// // hooks/useSongs.ts
// import { useState, useEffect } from "react";
// import useApi from "../apis/api";
// import type { Song } from "../apis/models/models";
// import { songsUseApi } from "../apis/endpoints/song";
// import { recommendationPopularApi } from "../apis/endpoints/recommendation";

// export const useSongs = () => {
//   const [songs, setSongs] = useState<Song[]>([]);
//   const [popularSongs, setPopularSongs] = useState<Song[]>([]);
//   const [isLoading, setIsLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);

//   const fetchSongsApi = useApi({
//     api: songsUseApi,
//     onSuccess: (data) => {
//       setSongs(data?.data || []);
//     },
//     onFail: (error) => {
//       setError("Failed to fetch songs");
//       console.error(error);
//     },
//   });

//   const fetchPopularApi = useApi({
//     api: recommendationPopularApi,
//     onSuccess: (data) => {
//       setPopularSongs(data?.data?.songs || data?.data || []);
//     },
//     onFail: (error) => {
//       setError("Failed to fetch popular songs");
//       console.error(error);
//     },
//   });

//   useEffect(() => {
//     const loadData = async () => {
//       setIsLoading(true);
//       setError(null);

//       try {
//         await Promise.all([
//           fetchSongsApi.process({}),
//           fetchPopularApi.process({}),
//         ]);
//       } catch (err) {
//         setError("Failed to load songs");
//       } finally {
//         setIsLoading(false);
//       }
//     };

//     loadData();
//   }, []);

//   const handleLike = (songId: string) => {
//     setSongs((prev) =>
//       prev.map((s) => (s.id === songId ? { ...s, is_liked: !s.is_liked } : s))
//     );

//     setPopularSongs((prev) =>
//       prev.map((s) => (s.id === songId ? { ...s, is_liked: !s.is_liked } : s))
//     );
//   };

//   const getDisplaySongs = () => {
//     return popularSongs.length > 0
//       ? popularSongs.slice(0, 4)
//       : songs.slice(0, 4);
//   };

//   return {
//     songs,
//     popularSongs,
//     displaySongs: getDisplaySongs(),
//     isLoading,
//     error,
//     handleLike,
//   };
// };
