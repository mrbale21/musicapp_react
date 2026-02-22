import { useEffect, useState } from "react";
import { Heart, X } from "lucide-react";
import { usePlayer } from "../context/PlayerContext";
import MusicCard from "../components/PopularCard";
import type { Song } from "../apis/models/models";
import { useNavigate, useParams } from "react-router-dom";
import useApi from "../apis/api";
import { songUseApiById } from "../apis/endpoints/song";
import LoadingSpinner from "../components/common/LoadingSpinner";
import { songLikeApi, songUnLikeApi } from "../apis/endpoints/songlike";
import { useMusicAlert } from "../utils/alerthelpers";
import { recommendationContentApi } from "../apis/endpoints/recommendation";

const SongDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { playSong } = usePlayer();
  const musicAlert = useMusicAlert();

  const [song, setSong] = useState<Song | null>(null);
  const [localLoading, setLocalLoading] = useState(false);

  const songById = useApi({ api: songUseApiById });
  const contentSong = useApi({ api: recommendationContentApi });
  const likeApi = useApi({ api: songLikeApi });
  const unlikeApi = useApi({ api: songUnLikeApi });

  // ===== FETCH DATA =====
  useEffect(() => {
    if (!id) return;

    songById.process({ id });
    contentSong.process({ song_id: id });
  }, [id]);

  // ===== SYNC API → LOCAL STATE =====
  useEffect(() => {
    if (songById.data?.data) {
      setSong(songById.data.data);
    }
  }, [songById.data]);

  const content = contentSong.data?.data.recommendations ?? [];

  if (songById.isLoading || !song) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  // ===== LIKE / UNLIKE =====
  const handleLike = async () => {
    if (!song || localLoading) return;

    try {
      setLocalLoading(true);

      if (song.is_liked) {
        await unlikeApi.process({ song_id: song.id });
        musicAlert.successUnlike();
        setSong({ ...song, is_liked: false });
      } else {
        await likeApi.process({ song_id: song.id });
        musicAlert.successLike();
        setSong({ ...song, is_liked: true });
      }
    } catch (e) {
      console.error(e);
      musicAlert.errorLike();
    } finally {
      setLocalLoading(false);
    }
  };

  // ===== PLAY + NAVIGATE =====
  const handlePlay = () => {
    playSong(song);
  };

  return (
    <div className="pb-32">
      <div className="relative">
        <button
          onClick={() => navigate("/home")}
          className="absolute top-4 left-4 z-10 w-10 h-10 bg-black/50 rounded-full flex items-center justify-center"
        >
          <X className="w-6 h-6 text-white" />
        </button>

        <div className="h-80 flex items-center justify-center bg-linear-to-b from-zinc-800 to-black">
          <img
            src={song.image_url}
            alt={song.title}
            className="w-64 h-64 rounded-lg shadow-xl"
          />
        </div>
      </div>

      <div className="p-6 space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-white">{song.title}</h1>
          <p className="text-zinc-400">{song.artist}</p>
        </div>

        <div className="flex gap-4">
          <button
            onClick={handlePlay}
            className="flex-1 bg-green-500 py-3 rounded-full font-semibold"
          >
            Play
          </button>

          <button
            onClick={handleLike}
            disabled={localLoading}
            className="w-12 h-12 bg-zinc-800 rounded-full flex items-center justify-center"
          >
            <Heart
              className={`w-6 h-6 ${
                song.is_liked ? "fill-green-500 text-green-500" : "text-white"
              }`}
            />
          </button>
        </div>

        <div>
          <h3 className="text-white font-semibold mb-4">Similar Songs</h3>
          <div className="grid grid-cols-2 gap-4">
            {content.slice(0, 4).map((rec) => (
              <MusicCard
                key={rec.song.id}
                song={rec.song}
                onPlay={() => {
                  playSong(rec.song);
                  navigate(`/song/${rec.song.id}`);
                }}
                onLike={() => {}}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SongDetailPage;
