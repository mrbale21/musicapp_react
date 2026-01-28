import { client } from "../client";
import type { songByIdResponse } from "../models/models";

export function searchSongsApi({}: {}): Promise<songByIdResponse> {
  return client.get(`/songs/search`, {}).then((response) => response.data);
}
