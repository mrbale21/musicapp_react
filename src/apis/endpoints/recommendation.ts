import { client } from "../client";
import type {
  collabRecommendationResponse,
  ContentRecommendationResponse,
  hybridRecommendationResponse,
  PopularSongsResponse,
} from "../models/models";

export function recommendationContentApi({
  song_id,
}: {
  song_id: string;
}): Promise<ContentRecommendationResponse> {
  return client
    .get(`/recommendations/content/${song_id}`, {})
    .then((response) => response.data);
}

export function recommendationCollabApi(): Promise<collabRecommendationResponse> {
  return client
    .get(`/recommendations/collaborative`, {})
    .then((response) => response.data);
}

export function recommendationHybridApi(): Promise<hybridRecommendationResponse> {
  return client
    .get(`/recommendations/smart-hybrid`, {})
    .then((response) => response.data);
}

export function recommendationPopularApi(): Promise<PopularSongsResponse> {
  return client
    .get(`/recommendations/popular`, {})
    .then((response) => response.data);
}
