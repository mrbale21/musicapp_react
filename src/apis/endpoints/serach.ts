import { client } from "../client";
import type { songByIdResponse } from "../models/models";

interface SearchSongsParams {
  q: string;
  limit?: number;
}

export function searchSongsApi({
  q,
  limit = 20,
}: SearchSongsParams): Promise<songByIdResponse> {
  return client
    .get("/songs/search", {
      params: {
        q,
        limit,
      },
    })
    .then((response) => response.data);
}
