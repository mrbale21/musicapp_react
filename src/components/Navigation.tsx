import React from "react";
import { NavLink } from "react-router-dom";

const Navigation: React.FC = () => {
  const navItems = [
    { path: "/", icon: "fa-home", label: "Home" },
    { path: "/search", icon: "fa-search", label: "Search" },
    { path: "/library", icon: "fa-music", label: "Library" },
    { path: "/playlist", icon: "fa-list", label: "Playlists" },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-spotify-light-dark border-t border-spotify-light-gray z-40">
      <div className="container mx-auto">
        <div className="flex justify-around items-center py-3">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `flex flex-col items-center ${
                  isActive ? "text-white" : "text-spotify-gray"
                } hover:text-white transition-colors`
              }
            >
              <i className={`fas ${item.icon} text-xl mb-1`}></i>
              <span className="text-xs font-medium">{item.label}</span>
            </NavLink>
          ))}
        </div>
      </div>
    </nav>
  );
};

// Gunakan export default, bukan export { Navigation }
export default Navigation;
