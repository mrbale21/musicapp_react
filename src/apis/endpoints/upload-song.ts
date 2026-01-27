import { client } from "../client";
import type { SongsRes } from "../models/song";

export const storeUploadSongRequestApi = (songId: string, mp3File: File) => {
  const formData = new FormData();

  // Hanya append 2 hal: file dan song_id
  formData.append("mp3_file", mp3File);
  formData.append("song_id", songId);

  console.log("Uploading file:", mp3File.name, mp3File.size, "bytes");
  console.log("Song ID:", songId);

  return client
    .post(`/admin/songs/${songId}/upload`, formData)
    .then((response) => response.data)
    .catch((error) => {
      console.error("Upload error:", {
        status: error.response?.status,
        data: error.response?.data,
        message: error.message,
      });
      throw error;
    });
};

export function songUploadStatsUseApi(): Promise<SongsRes> {
  return client.get("/admin/uploads/stats").then((response) => response.data);
}
