import React, { useState } from "react";
import { ChevronLeft, User, LogOut, X, AlertCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useCookies } from "react-cookie";

interface HeaderProps {
  title: string;
  showBack?: boolean;
  onBack?: () => void;
  rightElement?: React.ReactNode;
  showProfileIcon?: boolean;
}

interface ConfirmAlertProps {
  title: string;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
}

// Custom Confirm Alert Component
const ConfirmAlert: React.FC<ConfirmAlertProps> = ({
  title,
  message,
  onConfirm,
  onCancel,
}) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
      <div className="relative w-full max-w-sm">
        {/* Background Glow */}
        <div className="absolute -inset-1 bg-linear-to-r from-red-600 to-pink-500 rounded-2xl blur opacity-30"></div>

        <div className="relative bg-gray-900/95 backdrop-blur-xl rounded-2xl border border-red-500/30 shadow-2xl shadow-red-900/20 p-6">
          {/* Header */}
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-red-900/30 rounded-xl">
                <AlertCircle className="w-6 h-6 text-red-400" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white">{title}</h3>
                <div className="flex items-center gap-2 mt-1">
                  <div className="w-1 h-1 bg-red-500 rounded-full animate-pulse"></div>
                  <div className="w-1 h-1 bg-red-500 rounded-full animate-pulse delay-100"></div>
                  <div className="w-1 h-1 bg-red-500 rounded-full animate-pulse delay-200"></div>
                </div>
              </div>
            </div>

            <button
              onClick={onCancel}
              className="p-1 hover:bg-gray-800 rounded-lg transition-colors"
            >
              <X className="w-5 h-5 text-gray-400" />
            </button>
          </div>

          {/* Message */}
          <p className="text-gray-300 mb-6">{message}</p>

          {/* Actions */}
          <div className="flex gap-3">
            <button
              onClick={onCancel}
              className="flex-1 py-3 px-4 bg-gray-800 hover:bg-gray-700 text-gray-300 font-medium rounded-xl transition-all duration-200 active:scale-[0.98]"
            >
              Batal
            </button>

            <button
              onClick={onConfirm}
              className="flex-1 relative overflow-hidden group py-3 px-4 rounded-xl transition-all duration-200 active:scale-[0.98]"
            >
              <div className="absolute inset-0 bg-linear-to-r from-red-600 to-pink-500"></div>
              <div className="absolute inset-0 bg-linear-to-r from-red-500 to-pink-400 opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <div className="relative flex items-center justify-center gap-2 text-white font-semibold">
                <LogOut className="w-4 h-4" />
                <span>Logout</span>
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const Header: React.FC<HeaderProps> = ({
  title,
  showBack = false,
  onBack,
  rightElement,
  showProfileIcon = true,
}) => {
  const navigate = useNavigate();
  const [_, _setCookie, removeCookie] = useCookies(["app_user_token"]);
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

  const ProfileIcon = () => (
    <button
      onClick={handleProfileClick}
      className="relative p-2 hover:bg-gray-800/50 rounded-lg transition-all duration-200 group"
      aria-label="Profile"
    >
      <div className="relative">
        <div className="absolute -inset-1 bg-linear-to-r from-purple-600 to-pink-500 rounded-full blur opacity-0 group-hover:opacity-70 transition-opacity duration-300"></div>
        <User className="relative w-5 h-5 text-white" />
      </div>
      <div className="absolute -bottom-8 right-0 bg-black/90 text-white text-xs py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
        Profile
      </div>
    </button>
  );

  // Logout button
  const LogoutButton = () => (
    <button
      onClick={handleLogout}
      className="relative p-2 hover:bg-gray-800/50 rounded-lg transition-colors duration-200 group"
      aria-label="Logout"
    >
      <LogOut className="w-5 h-5 text-gray-300 group-hover:text-red-400 transition-colors" />
      <div className="absolute -bottom-8 right-0 bg-black/90 text-white text-xs py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
        Logout
      </div>
    </button>
  );

  return (
    <>
      <div className="sticky top-0 bg-black/95 backdrop-blur-sm z-40 p-4 border-b border-gray-800 flex items-center justify-between">
        <div className="flex items-center gap-3">
          {showBack && onBack && (
            <button
              onClick={onBack}
              className="p-1.5 hover:bg-gray-800/50 rounded-lg transition-colors duration-200 group relative"
              aria-label="Go back"
            >
              <ChevronLeft className="w-6 h-6 text-white" />
              <div className="absolute -bottom-8 left-0 bg-black/90 text-white text-xs py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                Back
              </div>
            </button>
          )}
          <h1 className="text-xl font-bold text-white">{title}</h1>
        </div>

        <div className="flex items-center gap-2">
          {rightElement}

          {/* Logout button hanya muncul di halaman profile */}
          {window.location.pathname === "/profile" && <LogoutButton />}

          {/* Profile icon muncul jika prop showProfileIcon true */}
          {showProfileIcon && <ProfileIcon />}
        </div>
      </div>

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
