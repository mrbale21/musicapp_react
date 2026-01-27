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

// export function categoriesStoreApi({
//   name,
//   description,
// }: {
//   name: string;
//   description: string;
// }): Promise<CategoriesRes> {
//   return client
//     .post("/categories", {
//       name,
//       description,
//     })
//     .then((response) => response.data);
// }

// export function categoriesUpdateApi({
//   id,
//   name,
//   description,
// }: {
//   id: number;
//   name: string;
//   description: string;
// }): Promise<CategoriesRes> {
//   return client
//     .put(`/categories/${id}`, {
//       name,
//       description,
//     })
//     .then((response) => response.data);
// }

// export function categoriesDeleteApi({
//   id,
// }: {
//   id: number;
// }): Promise<CategoriesRes> {
//   return client.delete(`/categories/${id}`).then((response) => response.data);
// }
