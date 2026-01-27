// App.tsx - Perbaikan struktur provider
import { Routes, Route, Navigate } from "react-router-dom";
import { PlayerProvider } from "./context/PlayerContext";
import HomePage from "./pages/HomePage";
import SongDetailPage from "./pages/SongDetailPage";
import CollaborativePage from "./pages/CollaborativePage";
import HybridPage from "./pages/HybridPage";
import LoginForm from "./components/LoginForm";
import { Authorize } from "./pages/Authorize";
import BottomPlayer from "./components/BottomPlayers";
import { AlertProvider } from "./context/AlertContext";
import AdminUploadPage from "./pages/AdminUploadFile";
import { YouTubePlayerProvider } from "./context/YoutubePLayerContext";

export default function App() {
  return (
    // Hierarki yang BENAR: YouTubePlayerProvider HARUS di luar PlayerProvider
    <YouTubePlayerProvider>
      <PlayerProvider>
        <AlertProvider>
          <div className="min-h-screen bg-black text-white">
            <Routes>
              {/* Public route */}
              <Route path="/auth" element={<LoginForm />} />

              {/* Protected routes */}
              <Route element={<Authorize />}>
                <Route path="/" element={<Navigate to="/home" replace />} />
                <Route path="/home" element={<HomePage />} />
                <Route path="/song/:id" element={<SongDetailPage />} />
                <Route path="/collaborative" element={<CollaborativePage />} />
                <Route path="/hybrid" element={<HybridPage />} />
                {/* Tambahkan route admin */}
                <Route path="/admin/upload" element={<AdminUploadPage />} />
              </Route>

              {/* Fallback route */}
              <Route path="*" element={<Navigate to="/auth" replace />} />
            </Routes>

            {/* Bottom player shows only on authenticated pages */}
            <Routes>
              <Route path="/auth" element={null} />
              <Route path="*" element={<BottomPlayer />} />
            </Routes>
          </div>
        </AlertProvider>
      </PlayerProvider>
    </YouTubePlayerProvider>
  );
}
