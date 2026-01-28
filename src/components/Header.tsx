import React from "react";
import { ChevronLeft, User, LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useCookies } from "react-cookie";

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
  const [_, _setCookie, removeCookie] = useCookies(["app_user_token"]);

  const handleLogout = () => {
    // Hapus cookie
    removeCookie("app_user_token", { path: "/" });

    // Hapus localStorage jika ada
    localStorage.clear();

    // Navigate ke auth page
    navigate("/auth", { replace: true });
  };

  const handleProfileClick = () => {
    navigate("/profile");
  };

  // Profile icon dengan efek modern
  const ProfileIcon = () => (
    <button
      onClick={handleProfileClick}
      className="relative p-2 hover:bg-gray-800/50 rounded-lg transition-all duration-200 group"
      aria-label="Profile"
    >
      <div className="relative">
        <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 to-pink-500 rounded-full blur opacity-0 group-hover:opacity-70 transition-opacity duration-300"></div>
        <User className="relative w-5 h-5 text-white" />
      </div>
    </button>
  );

  // Logout button
  const LogoutButton = () => (
    <button
      onClick={handleLogout}
      className="p-2 hover:bg-gray-800/50 rounded-lg transition-colors duration-200 group"
      aria-label="Logout"
    >
      <LogOut className="w-5 h-5 text-gray-300 group-hover:text-red-400 transition-colors" />
    </button>
  );

  return (
    <div className="sticky top-0 bg-black/95 backdrop-blur-sm z-10 p-4 border-b border-gray-800 flex items-center justify-between">
      <div className="flex items-center gap-3">
        {showBack && onBack && (
          <button
            onClick={onBack}
            className="p-1.5 hover:bg-gray-800/50 rounded-lg transition-colors duration-200"
            aria-label="Go back"
          >
            <ChevronLeft className="w-6 h-6 text-white" />
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
  );
};

export default Header;
