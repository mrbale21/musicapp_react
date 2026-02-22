import React, { useState } from "react";
import { ChevronLeft, User, LogOut,  Home } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { useCookies } from "react-cookie";
import ConfirmAlert from "./common/ConfirmAlert";

interface HeaderProps {
  title: string;
  showBack?: boolean;
  onBack?: () => void;
  rightElement?: React.ReactNode;
  showProfileIcon?: boolean;
}




const Header: React.FC<HeaderProps> = ({
  title,
  showBack = false,
  onBack,
  rightElement,
  showProfileIcon = true,
}) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [_, __, removeCookie] = useCookies(["app_user_token"]);
  const [showConfirm, setShowConfirm] = useState(false);

  const handleLogout = () => {
    setShowConfirm(true);
  };

  const confirmLogout = () => {
    removeCookie("app_user_token", { path: "/" });

    const keysToRemove = [
      "recent_searches",
      "user_played_songs",
      "player_state",
      "play_history",
      "liked_songs_cache",
    ];

    keysToRemove.forEach((key) => localStorage.removeItem(key));
    sessionStorage.clear();

    navigate("/auth", { replace: true });
    setShowConfirm(false);
  };

  const cancelLogout = () => {
    setShowConfirm(false);
  };

  const handleProfileClick = () => {
    navigate("/profile");
  };

  const handleHomeClick = () => {
    navigate("/");
  };

  const ProfileIcon = () => (
    <button
      onClick={handleProfileClick}
      className="relative p-2 hover:bg-gray-800/50 rounded-lg transition-all duration-200 group"
      aria-label="Profile"
    >
      <div className="relative">
        <div className="absolute -inset-1 bg-linear-to-r from-purple-600 to-pink-500 rounded-full blur opacity-0 group-hover:opacity-70 transition-opacity duration-300"></div>
        <div className="relative w-8 h-8 bg-linear-to-r from-purple-600 to-pink-500 rounded-lg flex items-center justify-center transform group-hover:scale-110 transition-transform duration-200">
          <User className="w-4 h-4 text-white" />
        </div>
      </div>
    </button>
  );

  const LogoutButton = () => (
    <button
      onClick={handleLogout}
      className="relative p-2 hover:bg-gray-800/50 rounded-lg transition-all duration-200 group"
      aria-label="Logout"
    >
      <div className="relative">
        <div className="absolute -inset-1 bg-linear-to-r from-red-600 to-pink-500 rounded-lg blur opacity-0 group-hover:opacity-50 transition-opacity duration-300"></div>
        <LogOut className="relative w-5 h-5 text-gray-300 group-hover:text-pink-400 group-hover:rotate-12 transition-all duration-200" />
      </div>

      {/* Tooltip */}
      <div className="absolute -bottom-8 right-0 bg-gray-900 text-white text-xs py-1 px-2 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap border border-pink-500/30 shadow-lg shadow-pink-500/20">
        Logout
      </div>
    </button>
  );

  const HomeButton = () => (
    <button
      onClick={handleHomeClick}
      className="relative p-2 hover:bg-gray-800/50 rounded-lg transition-all duration-200 group"
      aria-label="Home"
    >
      <div className="relative">
        <div className="absolute -inset-1 bg-linear-to-r from-purple-600 to-pink-500 rounded-lg blur opacity-0 group-hover:opacity-50 transition-opacity duration-300"></div>
        <Home className="relative w-5 h-5 text-gray-300 group-hover:text-purple-400 transition-colors" />
      </div>
    </button>
  );

  return (
    <>
      <header className="sticky top-0 z-40">
        {/* Glassmorphism background with linear */}
        <div className="absolute inset-0 bg-linear-to-r from-purple-900/30 via-gray-900/95 to-pink-900/30 backdrop-blur-xl border-b border-purple-500/20"></div>

        {/* Animated linear line */}
        <div className="absolute bottom-0 left-0 right-0 h-px bg-linear-to-r from-transparent via-purple-500 to-transparent"></div>

        {/* Content */}
        <div className="relative px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            {showBack && onBack ? (
              <button
                onClick={onBack}
                className="relative p-2 hover:bg-gray-800/50 rounded-lg transition-all duration-200 group"
                aria-label="Go back"
              >
                <div className="absolute -inset-1 bg-linear-to-r from-purple-600 to-pink-500 rounded-lg blur opacity-0 group-hover:opacity-50 transition-opacity duration-300"></div>
                <ChevronLeft className="relative w-5 h-5 text-white group-hover:-translate-x-0.5 transition-transform" />

                {/* Tooltip */}
                <div className="absolute -bottom-8 left-0 bg-gray-900 text-white text-xs py-1 px-2 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap border border-purple-500/30 shadow-lg shadow-purple-500/20">
                  Back
                </div>
              </button>
            ) : (
              <HomeButton />
            )}

            {/* Title with linear */}
            <h1 className="text-xl font-bold bg-linear-to-r from-purple-400 via-white to-pink-400 bg-clip-text text-transparent">
              {title}
            </h1>
          </div>

          <div className="flex items-center gap-2">
            {rightElement}

            {/* Dynamic buttons based on route */}
            {location.pathname === "/profile" ? (
              <>
                <LogoutButton />
                {showProfileIcon && <ProfileIcon />}
              </>
            ) : (
              showProfileIcon && <ProfileIcon />
            )}
          </div>
        </div>
      </header>

      {/* Custom Confirm Alert */}
      {showConfirm && (
        <ConfirmAlert
          title="Konfirmasi Logout"
          message="Kamu yakin ingin keluar dari akun ini? Semua data sesi akan dihapus."
          onConfirm={confirmLogout}
          onCancel={cancelLogout}
        />
      )}
    </>
  );
};

export default Header;
