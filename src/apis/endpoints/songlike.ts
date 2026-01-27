import { client } from "../client";
import type { SongsRes } from "../models/song";

export function songUseLikesApi(): Promise<SongsRes> {
  return client.get(`/user/likes`).then((response) => response.data);
}

export function songUsePlaysApi(): Promise<SongsRes> {
  return client.get(`/user/plays`).then((response) => response.data);
}

export function songLikeApi({
  song_id,
}: {
  song_id: string;
}): Promise<SongsRes> {
  return client
    .post(`/user/like/${song_id}`, {})
    .then((response) => response.data);
}

export function songUnLikeApi({
  song_id,
}: {
  song_id: string;
}): Promise<SongsRes> {
  return client
    .delete(`/user/like/${song_id}`, {})
    .then((response) => response.data);
}

export function songStorePlayApi({
  song_id,
}: {
  song_id: string;
}): Promise<SongsRes> {
  return client
    .post(`/user/play/${song_id}`, {})
    .then((response) => response.data);
}
