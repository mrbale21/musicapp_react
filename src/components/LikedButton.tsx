import React from "react";
import { Heart } from "lucide-react";

interface LikeButtonProps {
  isLiked: boolean;
  onClick: () => void;
}

const LikeButton: React.FC<LikeButtonProps> = ({ isLiked, onClick }) => (
  <button
    onClick={(e) => {
      e.stopPropagation();
      onClick();
    }}
    className="transition-all hover:scale-110"
  >
    <Heart
      className={`w-5 h-5 ${
        isLiked
          ? "fill-green-500 text-green-500"
          : "text-zinc-400 hover:text-white"
      }`}
    />
  </button>
);

export default LikeButton;
