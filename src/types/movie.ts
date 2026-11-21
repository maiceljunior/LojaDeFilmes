/** Filme como vem nas listas do TMDB (populares, busca, por gênero). */
export interface MovieSummary {
  id: number;
  title: string;
  overview: string;
  poster_path: string | null;
  backdrop_path: string | null;
  release_date: string;
  vote_average: number;
  genre_ids: number[];
}

export interface Genre {
  id: number;
  name: string;
}

export interface CastMember {
  id: number;
  name: string;
  character: string;
  profile_path: string | null;
}

/** Detalhes completos de um filme (página do filme). */
export interface MovieDetails extends Omit<MovieSummary, "genre_ids"> {
  genres: Genre[];
  runtime: number | null;
  tagline: string;
  credits?: { cast: CastMember[] };
  videos?: { results: { key: string; site: string; type: string; official: boolean }[] };
}

export interface Paginated<T> {
  page: number;
  results: T[];
  total_pages: number;
  total_results: number;
}

/** Item salvo no carrinho ou nos favoritos (só o necessário, para caber no localStorage). */
export interface StoredMovie {
  id: number;
  title: string;
  poster_path: string | null;
  release_date: string;
  vote_average: number;
}

export interface CartItem extends StoredMovie {
  quantity: number;
}
