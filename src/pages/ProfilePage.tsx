import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  User,
  Mail,
  Calendar,
  Music,
  Headphones,
  Heart,
  Crown,
  LogOut,
  ChevronRight,
  Star,
  Clock,
} from "lucide-react";
import { useUserData } from "../hooks/zustand";
import ConfirmAlert from "../components/common/ConfirmAlert";
import useApi from "../apis/api";
import { songUsePlaysApi } from "../apis/endpoints/songlike";
import type { PlayItem } from "../apis/models/models";

const ProfilePage: React.FC = () => {
  const navigate = useNavigate();
  const { user, setUser } = useUserData();
  const [showConfirm, setShowConfirm] = useState(false);
  const [recentPlays, setRecentPlays] = useState<PlayItem[]>([]);

  const playsSongsApi = useApi({
    api: songUsePlaysApi,
    onSuccess: (response) => {
      if (response?.data && Array.isArray(response.data)) {
        // Response.data langsung berisi array PlayItem
        const playItems: PlayItem[] = response.data;

        // Filter items yang memiliki song object dan sort by last_played (terbaru)
        const validItems = playItems
          .filter((item) => item.song)
          .sort(
            (a, b) =>
              new Date(b.last_played).getTime() -
              new Date(a.last_played).getTime(),
          );

        setRecentPlays(validItems);
      } else {
        console.warn("Invalid data structure for plays:", response);
        setRecentPlays([]);
      }
    },
    onFail: (error) => {
      console.error("Error fetching recent songs:", error);
      setRecentPlays([]);
    },
  });

  // Fetch data on mount
  useEffect(() => {
    playsSongsApi.process({});
  }, []);

  const handleBack = () => {
    navigate(-1);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("id-ID", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const formatRelativeTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 60) {
      return `${diffMins} menit lalu`;
    } else if (diffHours < 24) {
      return `${diffHours} jam lalu`;
    } else if (diffDays < 7) {
      return `${diffDays} hari lalu`;
    } else {
      return date.toLocaleDateString("id-ID", {
        day: "numeric",
        month: "short",
      });
    }
  };

  // Format judul lagu
  const formatSongTitle = (play: PlayItem) => {
    if (play.song?.title && play.song.title.trim() !== "") {
      return play.song.title;
    }
    return "Lagu";
  };

  // Format artist
  const formatArtist = (play: PlayItem) => {
    if (play.song?.artist && play.song.artist.trim() !== "") {
      return play.song.artist;
    }
    return "-";
  };

  // Navigasi ke halaman likes
  const navigateToLikes = () => {
    navigate("/like");
  };

  // Navigasi ke halaman play history
  const navigateToPlayHistory = () => {
    navigate("/play");
  };

  // Navigasi ke halaman popular
  const navigateToPopular = () => {
    navigate("/popular");
  };

  const handleLogoutClick = () => {
    setShowConfirm(true);
  };

  const confirmLogout = () => {
    // Hapus semua data auth
    document.cookie =
      "app_user_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC;";
    localStorage.clear();
    sessionStorage.clear();

    // Reset user state
    setUser(null);

    // Redirect ke login
    navigate("/auth", { replace: true });
    setShowConfirm(false);
  };

  const cancelLogout = () => {
    setShowConfirm(false);
  };

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen text-white">
        Loading profile...
      </div>
    );
  }

  // Hitung total play count dari data API
  const totalPlays =
    recentPlays.reduce(
      (sum: number, play: PlayItem) => sum + (play?.play_count || 0),
      0,
    ) || 0;

  return (
    <>
      <div className="min-h-screen bg-linear-to-br from-gray-900 via-purple-900/20 to-black pb-32 relative overflow-hidden">
        {/* Background Effects */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-20 -right-20 w-60 h-60 bg-purple-600/30 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute -bottom-20 -left-20 w-60 h-60 bg-pink-600/30 rounded-full blur-3xl animate-pulse delay-700"></div>
        </div>

        {/* Animated Particles */}
        <div className="absolute inset-0">
          {[...Array(5)].map((_, i) => (
            <div
              key={i}
              className="absolute w-1 h-1 bg-purple-500/30 rounded-full"
              style={{
                left: `${15 + i * 18}%`,
                top: `${10 + i * 20}%`,
                animation: `float 3s ease-in-out ${i * 0.5}s infinite`,
              }}
            ></div>
          ))}
        </div>

        <style>{`
          @keyframes float {
            0%, 100% { transform: translateY(0px); }
            50% { transform: translateY(-10px); }
          }
        `}</style>

        <div className="relative z-10">
          {/* Header - Sticky dengan backdrop blur */}
          <div className="sticky top-0 z-10 bg-black/80 backdrop-blur-xl border-b border-purple-500/20">
            <div className="px-4 py-3">
              <div className="flex items-center gap-3">
                <button
                  onClick={handleBack}
                  className="w-10 h-10 bg-black/60 backdrop-blur-sm border border-purple-500/30 rounded-full flex items-center justify-center active:bg-purple-900/30 transition-all active:scale-95"
                >
                  <ChevronRight className="w-5 h-5 text-white rotate-180" />
                </button>
                <div className="flex-1">
                  <h1 className="text-xl font-bold bg-linear-to-r from-purple-400 to-pink-300 bg-clip-text text-transparent">
                    Profile
                  </h1>
                  <p className="text-xs text-gray-400">
                    Informasi dan statistik akun
                  </p>
                </div>
                <div className="w-10 h-10 rounded-xl bg-linear-to-br from-purple-500/20 to-pink-500/20 flex items-center justify-center border border-purple-500/30">
                  <User className="w-5 h-5 text-purple-400" />
                </div>
              </div>
            </div>
          </div>

          {/* Profile Section */}
          <div className="p-4">
            {/* Profile Card */}
            <div className="bg-black/60 backdrop-blur-lg rounded-xl p-5 mb-4 border border-purple-500/20">
              {/* Avatar & Name */}
              <div className="flex items-center gap-4 mb-4">
                <div className="relative">
                  <div className="absolute -inset-1 bg-linear-to-r from-purple-600 to-pink-500 rounded-full blur opacity-70"></div>
                  <div className="relative w-16 h-16 rounded-full bg-black flex items-center justify-center border border-purple-500/30">
                    <User className="w-8 h-8 text-purple-400" />
                    {user?.role === "admin" && (
                      <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-linear-to-r from-yellow-500 to-orange-500 rounded-full flex items-center justify-center border border-yellow-300">
                        <Crown className="w-3 h-3 text-black" />
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h2 className="text-xl font-bold text-white">
                      {user?.username}
                    </h2>
                    {user?.role === "admin" && (
                      <div className="flex items-center gap-1 bg-linear-to-r from-yellow-500/20 to-orange-500/20 px-2 py-0.5 rounded-full border border-yellow-500/30">
                        <Crown className="w-3 h-3 text-yellow-400" />
                        <span className="text-[10px] font-semibold text-yellow-300">
                          Admin
                        </span>
                      </div>
                    )}
                  </div>
                  <div className="flex items-center gap-2 text-gray-400">
                    <Mail className="w-3 h-3" />
                    <p className="text-xs truncate">{user?.email}</p>
                  </div>
                </div>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-2 gap-3 mb-4">
                <button
                  onClick={navigateToLikes}
                  className="bg-black/40 rounded-xl p-3 border border-pink-500/20 active:border-pink-500/40 transition-all duration-200"
                >
                  <div className="flex items-center gap-2">
                    <div className="p-1.5 rounded-lg bg-linear-to-br from-pink-500/20 to-purple-500/20 border border-pink-500/30">
                      <Heart
                        className="w-4 h-4 text-pink-400"
                        fill="currentColor"
                      />
                    </div>
                    <div>
                      <p className="text-[10px] text-gray-400">Favorit</p>
                      <p className="text-lg font-bold text-white">
                        {user?.likes?.length || 0}
                      </p>
                    </div>
                  </div>
                </button>

                <button
                  onClick={navigateToPlayHistory}
                  className="bg-black/40 rounded-xl p-3 border border-blue-500/20 active:border-blue-500/40 transition-all duration-200"
                >
                  <div className="flex items-center gap-2">
                    <div className="p-1.5 rounded-lg bg-linear-to-br from-blue-500/20 to-teal-500/20 border border-blue-500/30">
                      <Headphones className="w-4 h-4 text-blue-400" />
                    </div>
                    <div>
                      <p className="text-[10px] text-gray-400">Total Putar</p>
                      <p className="text-lg font-bold text-white">
                        {totalPlays}
                      </p>
                    </div>
                  </div>
                </button>
              </div>

              {/* Info Grid */}
              <div className="space-y-2">
                <div className="flex items-center gap-2 p-2 bg-black/40 rounded-lg border border-gray-800">
                  <div className="p-1.5 rounded-lg bg-linear-to-br from-purple-500/10 to-pink-500/10 border border-purple-500/20">
                    <Mail className="w-3 h-3 text-purple-400" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[10px] text-gray-400">Email</p>
                    <p className="text-white text-xs truncate">{user?.email}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2 p-2 bg-black/40 rounded-lg border border-gray-800">
                  <div className="p-1.5 rounded-lg bg-linear-to-br from-purple-500/10 to-pink-500/10 border border-purple-500/20">
                    <Calendar className="w-3 h-3 text-purple-400" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[10px] text-gray-400">Bergabung</p>
                    <p className="text-white text-xs">
                      {user ? formatDate(user.created_at) : ""}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-black/60 backdrop-blur-lg rounded-xl p-4 mb-4 border border-purple-500/20">
              <h3 className="text-sm font-semibold text-white mb-3">
                Aksi Cepat
              </h3>
              <div className="space-y-2">
                <button
                  onClick={navigateToLikes}
                  className="w-full flex items-center justify-between p-3 bg-black/40 rounded-lg border border-pink-500/20 active:border-pink-500/40 transition-all duration-200"
                >
                  <div className="flex items-center gap-2">
                    <div className="p-1.5 rounded-lg bg-linear-to-br from-pink-500/20 to-purple-500/20 border border-pink-500/30">
                      <Heart
                        className="w-3.5 h-3.5 text-pink-400"
                        fill="currentColor"
                      />
                    </div>
                    <span className="text-sm text-white">Lagu Favorit</span>
                  </div>
                  <ChevronRight className="w-3.5 h-3.5 text-gray-400" />
                </button>

                <button
                  onClick={navigateToPlayHistory}
                  className="w-full flex items-center justify-between p-3 bg-black/40 rounded-lg border border-blue-500/20 active:border-blue-500/40 transition-all duration-200"
                >
                  <div className="flex items-center gap-2">
                    <div className="p-1.5 rounded-lg bg-linear-to-br from-blue-500/20 to-teal-500/20 border border-blue-500/30">
                      <Clock className="w-3.5 h-3.5 text-blue-400" />
                    </div>
                    <span className="text-sm text-white">Riwayat Putar</span>
                  </div>
                  <ChevronRight className="w-3.5 h-3.5 text-gray-400" />
                </button>

                <button
                  onClick={navigateToPopular}
                  className="w-full flex items-center justify-between p-3 bg-black/40 rounded-lg border border-purple-500/20 active:border-purple-500/40 transition-all duration-200"
                >
                  <div className="flex items-center gap-2">
                    <div className="p-1.5 rounded-lg bg-linear-to-br from-purple-500/20 to-pink-500/20 border border-purple-500/30">
                      <Star
                        className="w-3.5 h-3.5 text-purple-400"
                        fill="currentColor"
                      />
                    </div>
                    <span className="text-sm text-white">Lagu Populer</span>
                  </div>
                  <ChevronRight className="w-3.5 h-3.5 text-gray-400" />
                </button>
              </div>
            </div>

            {/* Recent Activity - Menggunakan data dari API */}
            <div className="bg-black/60 backdrop-blur-lg rounded-xl p-4 border border-purple-500/20">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-semibold text-white">
                  Aktivitas Terbaru
                </h3>
                <button
                  onClick={navigateToPlayHistory}
                  className="text-xs text-purple-400 active:text-purple-300 transition-colors flex items-center gap-0.5"
                >
                  Lihat Semua
                  <ChevronRight className="w-3 h-3" />
                </button>
              </div>

              <div className="space-y-2">
                {recentPlays.slice(0, 3).map((play: PlayItem) => (
                  <div
                    key={play.id}
                    className="flex items-center gap-2 p-2 bg-black/40 rounded-lg border border-gray-800 active:border-purple-500/30 transition-all duration-200"
                  >
                    <div className="p-1.5 rounded-lg bg-linear-to-br from-purple-500/10 to-pink-500/10 border border-purple-500/20">
                      <Music className="w-3.5 h-3.5 text-purple-400" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-white text-xs font-medium truncate">
                        {formatSongTitle(play)}
                      </p>
                      <div className="flex items-center gap-1 text-[10px] text-gray-400">
                        <span className="truncate max-w-80px">
                          {formatArtist(play)}
                        </span>
                        <span>•</span>
                        <span>{play.play_count}x</span>
                        <span>•</span>
                        <span className="text-teal-400 whitespace-nowrap">
                          {formatRelativeTime(play.last_played)}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}

                {recentPlays.length === 0 && (
                  <div className="text-center py-4">
                    <p className="text-xs text-gray-500">
                      Belum ada aktivitas mendengarkan
                    </p>
                  </div>
                )}
              </div>

              {/* Logout Button */}
              <button
                onClick={handleLogoutClick}
                className="w-full mt-4 p-3 bg-linear-to-r from-red-600/20 to-pink-600/20 active:from-red-600/30 active:to-pink-600/30 border border-red-500/30 rounded-lg text-red-400 active:text-red-300 transition-all duration-200 flex items-center justify-center gap-2"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span className="text-xs">Keluar Akun</span>
              </button>
            </div>

            {/* Footer Info */}
            <div className="mt-4 text-center">
              <div className="flex items-center justify-center gap-1.5 mb-1">
                <div className="w-1 h-1 bg-purple-500 rounded-full animate-pulse"></div>
                <div className="w-1 h-1 bg-pink-500 rounded-full animate-pulse delay-150"></div>
                <div className="w-1 h-1 bg-purple-500 rounded-full animate-pulse delay-300"></div>
              </div>
              <p className="text-[10px] text-gray-500">
                © 2024 SoundWave • Profile Anda
              </p>
            </div>
          </div>
        </div>

        {/* Bottom Glow */}
        <div className="fixed bottom-0 left-0 right-0 h-12 bg-linear-to-t from-black/80 to-transparent pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-linear-to-r from-transparent via-purple-500 to-transparent"></div>
      </div>

      {/* Confirm Logout Alert */}
      {showConfirm && (
        <ConfirmAlert
          title="Konfirmasi Logout"
          message="Kamu yakin ingin keluar dari akun ini?"
          onConfirm={confirmLogout}
          onCancel={cancelLogout}
        />
      )}
    </>
  );
};

export default ProfilePage;
