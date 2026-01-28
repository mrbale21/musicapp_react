import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import {
  User,
  Mail,
  Calendar,
  Music,
  Headphones,
  Heart,
  Crown,
} from "lucide-react";
import { useUserData } from "../hooks/zustand";

const ProfilePage: React.FC = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useUserData();

  // Simulasi fetch data user
  useEffect(() => {
    const fetchuser = async () => {
      setIsLoading(true);
      // Simulasi API call
    };

    fetchuser();
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
    navigate("/likes");
  };

  // Navigasi ke halaman play history
  const navigateToPlayHistory = () => {
    navigate("/play-history");
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black">
        <Header
          title="Profile"
          showBack
          onBack={handleBack}
          showProfileIcon={false}
        />
        <div className="flex items-center justify-center min-h-[80vh]">
          <div className="w-8 h-8 border-2 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white">
      <Header
        title="Profile"
        showBack
        onBack={handleBack}
        showProfileIcon={false}
      />

      {/* Profile Section */}
      <div className="p-6">
        {/* Profile Card */}
        <div className="bg-black/40 backdrop-blur-sm rounded-2xl border border-gray-800 p-6 mb-6">
          <div className="flex items-center gap-4 mb-6">
            <div className="relative">
              <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 to-pink-500 rounded-full blur opacity-70"></div>
              <div className="relative w-20 h-20 rounded-full bg-gray-900 flex items-center justify-center border border-purple-500/30">
                <User className="w-10 h-10 text-purple-400" />
              </div>
            </div>

            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <h2 className="text-2xl font-bold text-white">
                  {user?.username}
                </h2>
                {user?.role === "admin" && (
                  <div className="flex items-center gap-1 bg-gradient-to-r from-purple-600 to-pink-500 px-2 py-0.5 rounded-full">
                    <Crown className="w-3 h-3 text-yellow-300" />
                    <span className="text-xs font-semibold">Admin</span>
                  </div>
                )}
              </div>
              <p className="text-gray-400">{user?.email}</p>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div
              className="bg-gray-900/50 rounded-xl p-4 border border-gray-800 hover:border-purple-500/30 transition-all duration-200 cursor-pointer"
              onClick={navigateToLikes}
            >
              <div className="flex items-center gap-3">
                <div className="p-2 bg-pink-900/30 rounded-lg">
                  <Heart className="w-5 h-5 text-pink-400" />
                </div>
                <div>
                  <p className="text-sm text-gray-400">Liked Songs</p>
                  <p className="text-2xl font-bold text-white">
                    {user?.likes?.length || 0}
                  </p>
                </div>
              </div>
            </div>

            <div
              className="bg-gray-900/50 rounded-xl p-4 border border-gray-800 hover:border-purple-500/30 transition-all duration-200 cursor-pointer"
              onClick={navigateToPlayHistory}
            >
              <div className="flex items-center gap-3">
                <div className="p-2 bg-purple-900/30 rounded-lg">
                  <Headphones className="w-5 h-5 text-purple-400" />
                </div>
                <div>
                  <p className="text-sm text-gray-400">Total Plays</p>
                  <p className="text-2xl font-bold text-white">
                    {user?.plays?.reduce(
                      (sum, play) => sum + play.play_count,
                      0,
                    ) || 0}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Info Grid */}
          <div className="grid grid-cols-1 gap-3">
            <div className="flex items-center gap-3 p-3 bg-gray-900/30 rounded-lg">
              <Mail className="w-5 h-5 text-gray-400" />
              <div>
                <p className="text-sm text-gray-400">Email</p>
                <p className="text-white">{user?.email}</p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3 bg-gray-900/30 rounded-lg">
              <Calendar className="w-5 h-5 text-gray-400" />
              <div>
                <p className="text-sm text-gray-400">Member Since</p>
                <p className="text-white">
                  {user ? formatDate(user.created_at) : ""}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-black/40 backdrop-blur-sm rounded-2xl border border-gray-800 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-white">Recent Activity</h3>
            <button
              onClick={navigateToPlayHistory}
              className="text-sm text-purple-400 hover:text-purple-300 transition-colors"
            >
              See All →
            </button>
          </div>

          <div className="space-y-3">
            {user?.plays?.slice(0, 3).map((play) => (
              <div
                key={play.id}
                className="flex items-center gap-3 p-3 bg-gray-900/30 rounded-lg"
              >
                <div className="p-2 bg-purple-900/30 rounded-lg">
                  <Music className="w-4 h-4 text-purple-400" />
                </div>
                <div className="flex-1">
                  <p className="text-white">Song Played</p>
                  <p className="text-xs text-gray-400">
                    {play.play_count} plays • Last:{" "}
                    {formatDate(play.last_played)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
