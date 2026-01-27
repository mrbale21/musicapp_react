import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  type ReactNode,
} from "react";

interface LikeContextType {
  likedSongs: Set<string>;
  toggleLike: (songId: string) => void;
  isLiked: (songId: string) => boolean;
}

const LikeContext = createContext<LikeContextType | undefined>(undefined);

export const LikeProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [likedSongs, setLikedSongs] = useState<Set<string>>(() => {
    const stored = localStorage.getItem("likedSongs");
    return stored ? new Set(JSON.parse(stored)) : new Set();
  });

  useEffect(() => {
    localStorage.setItem("likedSongs", JSON.stringify([...likedSongs]));
  }, [likedSongs]);

  const toggleLike = (songId: string) => {
    setLikedSongs((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(songId)) {
        newSet.delete(songId);
      } else {
        newSet.add(songId);
      }
      return newSet;
    });
  };

  const isLiked = (songId: string) => likedSongs.has(songId);

  return (
    <LikeContext.Provider value={{ likedSongs, toggleLike, isLiked }}>
      {children}
    </LikeContext.Provider>
  );
};

export const useLike = () => {
  const context = useContext(LikeContext);
  if (!context) {
    throw new Error("useLike must be used within LikeProvider");
  }
  return context;
};
