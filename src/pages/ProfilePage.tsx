// pages/ProfilePage.tsx
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
import { useEffect } from "react";

const ProfilePage: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useUserData();

  useEffect(() => {
    user;
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

  const handleLogout = () => {
    // Hapus semua data auth
    document.cookie =
      "app_user_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC;";
    localStorage.clear();
    sessionStorage.clear();

    // Redirect ke login
    navigate("/auth", { replace: true });
  };

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen text-white">
        Loading profile...
      </div>
    );
  }

  return (
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
        {/* Header */}
        <div className="p-5 border-b border-purple-500/20">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <button
                onClick={handleBack}
                className="w-10 h-10 bg-black/60 backdrop-blur-sm border border-purple-500/30 rounded-full flex items-center justify-center hover:bg-purple-900/30 transition-all hover:scale-105"
              >
                <ChevronRight className="w-5 h-5 text-white rotate-180" />
              </button>
              <div>
                <h1 className="text-2xl font-bold bg-linear-to-r from-purple-400 to-pink-300 bg-clip-text text-transparent">
                  Profile
                </h1>
                <p className="text-sm text-gray-400">
                  Informasi dan statistik akun
                </p>
              </div>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-linear-to-br from-purple-500/20 to-pink-500/20 flex items-center justify-center border border-purple-500/30">
              <User className="w-6 h-6 text-purple-400" />
            </div>
          </div>
        </div>

        {/* Profile Section */}
        <div className="p-5">
          {/* Profile Card */}
          <div className="bg-black/60 backdrop-blur-lg rounded-2xl p-6 mb-6 border border-purple-500/20 shadow-xl shadow-purple-900/20">
            {/* Avatar & Name */}
            <div className="flex items-center gap-4 mb-6">
              <div className="relative">
                <div className="absolute -inset-1 bg-linear-to-r from-purple-600 to-pink-500 rounded-full blur opacity-70 animate-pulse"></div>
                <div className="relative w-20 h-20 rounded-full bg-black flex items-center justify-center border border-purple-500/30">
                  <User className="w-10 h-10 text-purple-400" />
                  {user?.role === "admin" && (
                    <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-linear-to-r from-yellow-500 to-orange-500 rounded-full flex items-center justify-center border border-yellow-300">
                      <Crown className="w-3 h-3 text-black" />
                    </div>
                  )}
                </div>
              </div>

              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <h2 className="text-2xl font-bold text-white">
                    {user?.username}
                  </h2>
                  {user?.role === "admin" && (
                    <div className="flex items-center gap-1 bg-linear-to-r from-yellow-500/20 to-orange-500/20 px-3 py-1 rounded-full border border-yellow-500/30">
                      <Crown className="w-3 h-3 text-yellow-400" />
                      <span className="text-xs font-semibold text-yellow-300">
                        Admin
                      </span>
                    </div>
                  )}
                </div>
                <div className="flex items-center gap-2 text-gray-400">
                  <Mail className="w-4 h-4" />
                  <p className="text-sm">{user?.email}</p>
                </div>
              </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 gap-4 mb-6">
              <button
                onClick={navigateToLikes}
                className="bg-black/40 backdrop-blur-sm rounded-xl p-4 border border-pink-500/20 hover:border-pink-500/40 hover:shadow-lg hover:shadow-pink-900/20 transition-all duration-200 cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-linear-to-br from-pink-500/20 to-purple-500/20 border border-pink-500/30">
                    <Heart
                      className="w-5 h-5 text-pink-400"
                      fill="currentColor"
                    />
                  </div>
                  <div>
                    <p className="text-xs text-gray-400">Lagu Favorit</p>
                    <p className="text-2xl font-bold text-white">
                      {user?.likes?.length || 0}
                    </p>
                  </div>
                </div>
              </button>

              <button
                onClick={navigateToPlayHistory}
                className="bg-black/40 backdrop-blur-sm rounded-xl p-4 border border-blue-500/20 hover:border-blue-500/40 hover:shadow-lg hover:shadow-blue-900/20 transition-all duration-200 cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-linear-to-br from-blue-500/20 to-teal-500/20 border border-blue-500/30">
                    <Headphones className="w-5 h-5 text-blue-400" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-400">Total Putar</p>
                    <p className="text-2xl font-bold text-white">
                      {user?.plays?.reduce(
                        (sum, play) => sum + play.play_count,
                        0,
                      ) || 0}
                    </p>
                  </div>
                </div>
              </button>
            </div>

            {/* Info Grid */}
            <div className="space-y-3">
              <div className="flex items-center gap-3 p-3 bg-black/40 rounded-xl border border-gray-800">
                <div className="p-2 rounded-lg bg-linear-to-br from-purple-500/10 to-pink-500/10 border border-purple-500/20">
                  <Mail className="w-4 h-4 text-purple-400" />
                </div>
                <div>
                  <p className="text-xs text-gray-400">Email</p>
                  <p className="text-white text-sm">{user?.email}</p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 bg-black/40 rounded-xl border border-gray-800">
                <div className="p-2 rounded-lg bg-linear-to-br from-purple-500/10 to-pink-500/10 border border-purple-500/20">
                  <Calendar className="w-4 h-4 text-purple-400" />
                </div>
                <div>
                  <p className="text-xs text-gray-400">Bergabung Sejak</p>
                  <p className="text-white text-sm">
                    {user ? formatDate(user.created_at) : ""}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-black/60 backdrop-blur-lg rounded-2xl p-6 mb-6 border border-purple-500/20 shadow-xl shadow-purple-900/20">
            <h3 className="text-lg font-semibold text-white mb-4">
              Aksi Cepat
            </h3>
            <div className="space-y-2">
              <button
                onClick={navigateToLikes}
                className="w-full flex items-center justify-between p-3 bg-black/40 rounded-xl border border-pink-500/20 hover:border-pink-500/40 hover:shadow-lg hover:shadow-pink-900/20 transition-all duration-200"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-linear-to-br from-pink-500/20 to-purple-500/20 border border-pink-500/30">
                    <Heart
                      className="w-4 h-4 text-pink-400"
                      fill="currentColor"
                    />
                  </div>
                  <span className="text-white">Lagu Favorit</span>
                </div>
                <ChevronRight className="w-4 h-4 text-gray-400" />
              </button>

              <button
                onClick={navigateToPlayHistory}
                className="w-full flex items-center justify-between p-3 bg-black/40 rounded-xl border border-blue-500/20 hover:border-blue-500/40 hover:shadow-lg hover:shadow-blue-900/20 transition-all duration-200"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-linear-to-br from-blue-500/20 to-teal-500/20 border border-blue-500/30">
                    <Clock className="w-4 h-4 text-blue-400" />
                  </div>
                  <span className="text-white">Riwayat Putar</span>
                </div>
                <ChevronRight className="w-4 h-4 text-gray-400" />
              </button>

              <button
                onClick={navigateToPopular}
                className="w-full flex items-center justify-between p-3 bg-black/40 rounded-xl border border-purple-500/20 hover:border-purple-500/40 hover:shadow-lg hover:shadow-purple-900/20 transition-all duration-200"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-linear-to-br from-purple-500/20 to-pink-500/20 border border-purple-500/30">
                    <Star
                      className="w-4 h-4 text-purple-400"
                      fill="currentColor"
                    />
                  </div>
                  <span className="text-white">Lagu Populer</span>
                </div>
                <ChevronRight className="w-4 h-4 text-gray-400" />
              </button>

              {/* {user?.role === "admin" && (
                <button
                  onClick={() => navigate("/admin/upload")}
                  className="w-full flex items-center justify-between p-3 bg-black/40 rounded-xl border border-yellow-500/20 hover:border-yellow-500/40 hover:shadow-lg hover:shadow-yellow-900/20 transition-all duration-200"
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-linear-to-br from-yellow-500/20 to-orange-500/20 border border-yellow-500/30">
                      <Settings className="w-4 h-4 text-yellow-400" />
                    </div>
                    <span className="text-white">Admin Upload</span>
                  </div>
                  <ChevronRight className="w-4 h-4 text-gray-400" />
                </button>
              )} */}
            </div>
          </div>

          {/* Recent Activity */}
          <div className="bg-black/60 backdrop-blur-lg rounded-2xl p-6 border border-purple-500/20 shadow-xl shadow-purple-900/20">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-white">
                Aktivitas Terbaru
              </h3>
              <button
                onClick={navigateToPlayHistory}
                className="text-sm text-purple-400 hover:text-purple-300 transition-colors flex items-center gap-1"
              >
                Lihat Semua
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3">
              {user?.plays?.slice(0, 3).map((play) => (
                <div
                  key={play.id}
                  className="flex items-center gap-3 p-3 bg-black/40 rounded-xl border border-gray-800 hover:border-purple-500/30 transition-all duration-200"
                >
                  <div className="p-2 rounded-lg bg-linear-to-br from-purple-500/10 to-pink-500/10 border border-purple-500/20">
                    <Music className="w-4 h-4 text-purple-400" />
                  </div>
                  <div className="flex-1">
                    <p className="text-white text-sm">Lagu Diputar</p>
                    <p className="text-xs text-gray-400">
                      {play.play_count} kali diputar • Terakhir:{" "}
                      {formatDate(play.last_played)}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Logout Button */}
            <button
              onClick={handleLogout}
              className="w-full mt-6 p-3 bg-linear-to-r from-red-600/20 to-pink-600/20 hover:from-red-600/30 hover:to-pink-600/30 border border-red-500/30 hover:border-red-500/50 rounded-xl text-red-400 hover:text-red-300 transition-all duration-200 flex items-center justify-center gap-2"
            >
              <LogOut className="w-4 h-4" />
              <span>Keluar Akun</span>
            </button>
          </div>

          {/* Footer Info */}
          <div className="mt-6 text-center">
            <div className="flex items-center justify-center gap-2 mb-2">
              <div className="w-1.5 h-1.5 bg-purple-500 rounded-full animate-pulse"></div>
              <div className="w-1.5 h-1.5 bg-pink-500 rounded-full animate-pulse delay-150"></div>
              <div className="w-1.5 h-1.5 bg-purple-500 rounded-full animate-pulse delay-300"></div>
            </div>
            <p className="text-xs text-gray-500">
              © 2024 SoundWave • Profile Anda
            </p>
          </div>
        </div>
      </div>

      {/* Bottom Glow */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-linear-to-r from-transparent via-purple-500 to-transparent"></div>
    </div>
  );
};

export default ProfilePage;
