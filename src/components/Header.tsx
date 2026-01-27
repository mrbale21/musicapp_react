import React from "react";

interface HeaderProps {
  title: string;
}

const Header: React.FC<HeaderProps> = ({ title }) => (
  <div className="sticky top-0 bg-black/95 backdrop-blur-sm z-10 p-4 border-b border-zinc-800">
    <h1 className="text-2xl font-bold text-white">{title}</h1>
  </div>
);

export default Header;
