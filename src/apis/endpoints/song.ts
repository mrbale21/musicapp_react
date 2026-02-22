import { client } from "../client";
import type {
  songByIdResponse,
  songResourceResponse,
  SongsListResponse,
} from "../models/models";

export function songsUseApi(): Promise<SongsListResponse> {
  return client.get("/songs").then((response) => response.data);
}

export function songUseApiById({
  id,
}: {
  id: string;
}): Promise<songByIdResponse> {
  return client.get(`/songs/${id}`, {}).then((response) => response.data);
}

export function songResourceApiYoutube({
  id,
}: {
  id: string;
}): Promise<songResourceResponse> {
  return client
    .get(`/songs/${id}/source`, {})
    .then((response) => response.data)
    .catch((error) => {
      // ⭐ Handle 404 specifically
      if (error.response?.status === 404) {
        console.warn(`YouTube source not found for song ID: ${id}`);
        // Return empty response untuk indicate not found
        return {
          data: {
            source: "",
            video_id: "",
          },
          status: "not_found",
        };
      }
      // Re-throw other errors
      throw error;
    });
}
