import type { Genre, MovieDetails, MovieSummary, Paginated } from "@/types/movie";

const BASE_URL = "https://api.themoviedb.org/3";
const IMAGE_URL = "https://image.tmdb.org/t/p";

const apiKey = import.meta.env.VITE_TMDB_API_KEY;

export class TmdbError extends Error {}

async function request<T>(path: string, params: Record<string, string | number> = {}): Promise<T> {
  if (!apiKey) {
    throw new TmdbError("Chave do TMDB não configurada. Crie o arquivo .env.local (veja o .env.example).");
  }

  const url = new URL(BASE_URL + path);
  url.search = new URLSearchParams({
    api_key: apiKey,
    language: "pt-BR",
    include_adult: "false",
    ...Object.fromEntries(Object.entries(params).map(([k, v]) => [k, String(v)])),
  }).toString();

  const response = await fetch(url);
  if (!response.ok) {
    throw new TmdbError(`Não foi possível carregar os filmes (erro ${response.status}).`);
  }
  return response.json() as Promise<T>;
}

export const tmdb = {
  popular: (page = 1) => request<Paginated<MovieSummary>>("/movie/popular", { page }),

  search: (query: string, page = 1) => request<Paginated<MovieSummary>>("/search/movie", { query, page }),

  byGenre: (genreId: number, page = 1) =>
    request<Paginated<MovieSummary>>("/discover/movie", {
      with_genres: genreId,
      sort_by: "popularity.desc",
      page,
    }),

  details: (id: number) => request<MovieDetails>(`/movie/${id}`, { append_to_response: "credits,videos" }),

  genres: () => request<{ genres: Genre[] }>("/genre/movie/list").then((r) => r.genres),
};

export function imageUrl(path: string | null, size: "w185" | "w342" | "w500" | "w780" | "original" = "w342") {
  return path ? `${IMAGE_URL}/${size}${path}` : null;
}
