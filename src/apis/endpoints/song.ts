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
    .then((response) => response.data);
}
