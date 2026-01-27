// pages/admin/AdminUploadPage.tsx - VERSI SIMPLE
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Upload,
  Music,
  FileAudio,
  CheckCircle,
  AlertCircle,
  BarChart,
  X,
  Plus,
  Search,
} from "lucide-react";
import Header from "../components/Header";
import LoadingSpinner from "../components/common/LoadingSpinner";
import { useMusicAlert } from "../utils/alerthelpers";
import {
  songUploadStatsUseApi,
  storeUploadSongRequestApi,
} from "../apis/endpoints/upload-song";
import useApi from "../apis/api";
import { songUsePlaysApi } from "../apis/endpoints/songlike";
import { songsUseApi } from "../apis/endpoints/song";

const AdminUploadPage = () => {
  const navigate = useNavigate();
  const musicAlert = useMusicAlert();

  // State untuk upload
  const [songId, setSongId] = useState("");
  const [mp3File, setMp3File] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>("");
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const [isUploading, setIsUploading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [successMessage, setSuccessMessage] = useState<string>("");

  // State untuk existing songs (opsional, untuk referensi)
  const [existingSongs, setExistingSongs] = useState<any[]>([]);

  const statsUpload = useApi({ api: songUploadStatsUseApi });
  const songApi = useApi({ api: songsUseApi });

  useEffect(() => {
    statsUpload.process({});
    songApi.process({});
  }, []);
  // Handle file selection
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Clear previous messages
    setErrorMessage("");
    setSuccessMessage("");

    // Validasi file type
    if (!file.type.includes("audio/mpeg") && !file.name.endsWith(".mp3")) {
      setErrorMessage("❌ File harus berformat MP3!");
      musicAlert.errorLike();
      return;
    }

    // Validasi file size (max 50MB)
    if (file.size > 50 * 1024 * 1024) {
      setErrorMessage("❌ Ukuran file terlalu besar! Maksimal 50MB");
      musicAlert.errorLike();
      return;
    }

    setMp3File(file);
    setPreviewUrl(URL.createObjectURL(file));
    setSuccessMessage("✅ File MP3 berhasil dipilih!");
    setTimeout(() => setSuccessMessage(""), 3000);
  };

  // Remove selected file
  const removeFile = () => {
    setMp3File(null);
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }
    setPreviewUrl("");
  };

  // Format file size
  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Clear previous messages
    setErrorMessage("");
    setSuccessMessage("");

    // Validasi
    if (!mp3File) {
      setErrorMessage("❌ Pilih file MP3 terlebih dahulu!");
      musicAlert.errorLike();
      return;
    }

    if (!songId.trim()) {
      setErrorMessage("❌ Masukkan Song ID terlebih dahulu!");
      musicAlert.errorLike();
      return;
    }

    // Validasi song_id format (UUID)
    const uuidRegex =
      /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    if (!uuidRegex.test(songId.trim())) {
      setErrorMessage("❌ Format Song ID tidak valid! Harus format UUID");
      musicAlert.errorLike();
      return;
    }

    setIsUploading(true);
    setUploadProgress(0);

    try {
      // Simulasi upload progress
      const progressInterval = setInterval(() => {
        setUploadProgress((prev) => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return prev;
          }
          return prev + 10;
        });
      }, 200);

      // Upload file - hanya 2 parameter: songId dan mp3File
      await storeUploadSongRequestApi(songId.trim(), mp3File);

      clearInterval(progressInterval);
      setUploadProgress(100);

      // Success feedback
      setSuccessMessage("🎉 Upload berhasil! File MP3 telah tersimpan");
      musicAlert.successLike();

      // Reset form setelah 2 detik
      setTimeout(() => {
        resetForm();
        setSuccessMessage("");
      }, 2000);
    } catch (error: any) {
      console.error("Upload error:", error);

      // Tampilkan error detail ke user
      let errorMessage = "❌ Upload gagal! ";

      if (error.response?.status === 400) {
        errorMessage += "Format Song ID salah";
      } else if (error.response?.status === 404) {
        errorMessage += "Song tidak ditemukan dengan ID ini";
      } else if (error.response?.status === 413) {
        errorMessage += "File terlalu besar (max 50MB)";
      } else if (error.response?.status === 415) {
        errorMessage += "Format file tidak didukung";
      } else if (error.response?.status === 500) {
        errorMessage += "Server error, coba lagi nanti";
      } else if (error.response?.data?.message) {
        errorMessage += error.response.data.message;
      } else if (error.message) {
        errorMessage += error.message;
      } else {
        errorMessage += "Terjadi kesalahan, coba lagi";
      }

      setErrorMessage(errorMessage);
      musicAlert.errorLike();

      setIsUploading(false);
      setUploadProgress(0);
    }
  };

  // Reset form
  const resetForm = () => {
    setSongId("");
    setMp3File(null);
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }
    setPreviewUrl("");
    setUploadProgress(0);
    setIsUploading(false);
    setErrorMessage("");
    setSuccessMessage("");
  };

  // Search existing songs (opsional)
  const handleSearch = () => {
    if (!searchQuery.trim()) return;
    // Implement search logic here if needed
  };

  return (
    <div className="min-h-screen bg-black text-white pb-32">
      <Header title="Admin Upload" />

      {/* Toast Notifications - Fixed position untuk mobile */}
      {(errorMessage || successMessage) && (
        <div className="fixed top-20 left-4 right-4 z-50 animate-slide-down">
          {errorMessage && (
            <div className="bg-red-600/95 backdrop-blur-sm border border-red-500 text-white px-4 py-4 rounded-xl shadow-2xl mb-3">
              <div className="flex items-start gap-3">
                <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                <div className="flex-1">
                  <p className="font-semibold text-sm mb-1">Error</p>
                  <p className="text-sm leading-relaxed">{errorMessage}</p>
                </div>
                <button
                  onClick={() => setErrorMessage("")}
                  className="flex-shrink-0 w-6 h-6 rounded-full hover:bg-red-700 flex items-center justify-center transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
          {successMessage && (
            <div className="bg-green-600/95 backdrop-blur-sm border border-green-500 text-white px-4 py-4 rounded-xl shadow-2xl">
              <div className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                <div className="flex-1">
                  <p className="font-semibold text-sm mb-1">Berhasil</p>
                  <p className="text-sm leading-relaxed">{successMessage}</p>
                </div>
                <button
                  onClick={() => setSuccessMessage("")}
                  className="flex-shrink-0 w-6 h-6 rounded-full hover:bg-green-700 flex items-center justify-center transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      <div className="p-4 md:p-6 space-y-4 md:space-y-6">
        {/* Search Section (Opsional) */}
        <div className="bg-zinc-900/30 rounded-xl p-4 md:p-6">
          <div className="flex items-center gap-3 mb-3 md:mb-4">
            <Search className="w-5 h-5 text-blue-400 flex-shrink-0" />
            <h3 className="text-base md:text-lg font-semibold text-white">
              Find Song by ID
            </h3>
          </div>
          <div className="flex flex-col sm:flex-row gap-2">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Enter Song ID (UUID)..."
              className="flex-1 px-3 md:px-4 py-2.5 md:py-3 bg-zinc-800/50 border border-zinc-700 rounded-lg text-white text-sm md:text-base placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <button
              onClick={handleSearch}
              className="px-5 md:px-6 py-2.5 md:py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center justify-center gap-2 text-sm md:text-base"
            >
              <Search className="w-4 h-4" />
              <span>Search</span>
            </button>
          </div>
        </div>

        {/* Upload Form - MOBILE OPTIMIZED */}
        <div className="bg-zinc-900/30 rounded-xl p-4 md:p-6">
          <div className="flex items-center gap-3 mb-4 md:mb-6">
            <Upload className="w-5 md:w-6 h-5 md:h-6 text-green-400 flex-shrink-0" />
            <h2 className="text-lg md:text-xl font-bold text-white">Upload MP3 File</h2>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4 md:space-y-6">
            {/* Song ID Input */}
            <div>
              <label className="block text-sm font-medium text-zinc-300 mb-2">
                Song ID (UUID) *
              </label>
              <input
                type="text"
                value={songId}
                onChange={(e) => setSongId(e.target.value)}
                required
                placeholder="e09f24c7-5232-43db-9c56-e3b92c864128"
                className="w-full px-3 md:px-4 py-2.5 md:py-3 bg-zinc-800/50 border border-zinc-700 rounded-lg text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent font-mono text-xs md:text-sm"
                pattern="[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}"
                title="Enter a valid UUID format"
              />
              <p className="text-xs text-zinc-400 mt-2 leading-relaxed">
                Must be a valid UUID (32 hexadecimal characters with hyphens)
              </p>
            </div>

            {/* File Upload Area */}
            <div>
              <label className="block text-sm font-medium text-zinc-300 mb-2 md:mb-3">
                MP3 File *
              </label>

              {!mp3File ? (
                <div className="border-2 border-dashed border-zinc-700 rounded-xl p-6 md:p-8 text-center hover:border-green-500 transition-colors cursor-pointer group">
                  <input
                    type="file"
                    id="mp3-file"
                    accept=".mp3,audio/mpeg"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                  <label htmlFor="mp3-file" className="cursor-pointer block">
                    <div className="space-y-3">
                      <div className="w-14 h-14 md:w-16 md:h-16 mx-auto bg-zinc-800 rounded-full flex items-center justify-center group-hover:bg-green-900/20 transition-colors">
                        <Upload className="w-7 h-7 md:w-8 md:h-8 text-zinc-400 group-hover:text-green-400 transition-colors" />
                      </div>
                      <div>
                        <p className="text-white font-medium text-sm md:text-base">
                          Tap untuk pilih file MP3
                        </p>
                        <p className="text-xs md:text-sm text-zinc-400 mt-1">
                          Format .mp3 saja (maks 50MB)
                        </p>
                      </div>
                      <div className="inline-flex items-center gap-2 bg-zinc-800 px-4 py-2 rounded-lg group-hover:bg-green-900/30 transition-colors text-sm">
                        <Plus className="w-4 h-4" />
                        <span>Pilih File MP3</span>
                      </div>
                    </div>
                  </label>
                </div>
              ) : (
                <div className="border border-zinc-700 rounded-xl p-3 md:p-4">
                  <div className="flex items-center justify-between mb-3 md:mb-4 gap-3">
                    <div className="flex items-center gap-2 md:gap-3 min-w-0 flex-1">
                      <div className="w-10 h-10 md:w-12 md:h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg flex items-center justify-center flex-shrink-0">
                        <FileAudio className="w-5 h-5 md:w-6 md:h-6 text-white" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="font-medium text-white text-sm md:text-base truncate">
                          {mp3File.name}
                        </p>
                        <div className="flex items-center gap-2 text-xs md:text-sm text-zinc-400 flex-wrap">
                          <span className="truncate">{formatFileSize(mp3File.size)}</span>
                          <span className="hidden sm:inline">•</span>
                          <span className="hidden sm:inline truncate">{mp3File.type}</span>
                        </div>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={removeFile}
                      className="w-8 h-8 rounded-full bg-zinc-800 flex items-center justify-center hover:bg-zinc-700 transition-colors flex-shrink-0"
                      disabled={isUploading}
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Progress Bar */}
                  {isUploading && (
                    <div className="space-y-2">
                      <div className="h-2 bg-zinc-800 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-green-500 to-emerald-500 transition-all duration-300"
                          style={{ width: `${uploadProgress}%` }}
                        />
                      </div>
                      <div className="flex justify-between text-xs text-zinc-400">
                        <span>Uploading...</span>
                        <span className="font-semibold">{uploadProgress}%</span>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Form Actions */}
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 pt-3 md:pt-4 border-t border-zinc-800">
              <button
                type="button"
                onClick={resetForm}
                disabled={isUploading}
                className="w-full sm:w-auto px-5 md:px-6 py-2.5 md:py-3 bg-zinc-800 text-white rounded-lg font-medium hover:bg-zinc-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm md:text-base"
              >
                Clear All
              </button>

              <button
                type="submit"
                disabled={isUploading || !mp3File || !songId}
                className="flex-1 px-5 md:px-6 py-2.5 md:py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-lg font-medium hover:opacity-90 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-sm md:text-base"
              >
                {isUploading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Uploading...</span>
                  </>
                ) : (
                  <>
                    <Upload className="w-4 md:w-5 h-4 md:h-5" />
                    <span>Upload MP3 File</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>

        {/* Instructions */}
        <div className="bg-zinc-900/30 rounded-xl p-4 md:p-6">
          <h3 className="text-base md:text-lg font-semibold text-white mb-3 md:mb-4">
            Cara Upload
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
            <div className="space-y-2 md:space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-blue-900/30 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-blue-400 font-bold text-sm">1</span>
                </div>
                <h4 className="font-medium text-white text-sm md:text-base">Get Song ID</h4>
              </div>
              <p className="text-xs md:text-sm text-zinc-400 leading-relaxed">
                Ambil Song ID (UUID) dari database atau buat song baru terlebih dahulu.
              </p>
            </div>

            <div className="space-y-2 md:space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-green-900/30 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-green-400 font-bold text-sm">2</span>
                </div>
                <h4 className="font-medium text-white text-sm md:text-base">Pilih File MP3</h4>
              </div>
              <p className="text-xs md:text-sm text-zinc-400 leading-relaxed">
                Pilih file .mp3 dari device Anda. Maksimal ukuran file 50MB.
              </p>
            </div>

            <div className="space-y-2 md:space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-purple-900/30 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-purple-400 font-bold text-sm">3</span>
                </div>
                <h4 className="font-medium text-white text-sm md:text-base">Upload</h4>
              </div>
              <p className="text-xs md:text-sm text-zinc-400 leading-relaxed">
                Klik upload untuk mengunggah file MP3 ke song. Proses mungkin memakan waktu.
              </p>
            </div>
          </div>

          <div className="mt-4 md:mt-6 p-3 md:p-4 bg-yellow-900/20 border border-yellow-700/30 rounded-lg">
            <h4 className="font-medium text-yellow-300 mb-2 text-sm md:text-base flex items-center gap-2">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              Catatan Penting
            </h4>
            <ul className="space-y-1.5 md:space-y-2 text-xs md:text-sm text-yellow-200/80">
              <li className="leading-relaxed">
                • Song harus sudah ada di database sebelum upload MP3
              </li>
              <li className="leading-relaxed">• Hanya file .mp3 yang didukung</li>
              <li className="leading-relaxed">• Nama file sebaiknya tanpa karakter spesial</li>
              <li className="leading-relaxed">• Upload akan mengganti file MP3 yang sudah ada</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminUploadPage;
