import { ref, shallowRef } from "vue";
import type { MovieSummary, Paginated } from "@/types/movie";

type Loader = (page: number) => Promise<Paginated<MovieSummary>>;

/**
 * Lista paginada com "carregar mais" (usada na rolagem infinita).
 * Troque a fonte com reset(novoLoader) — ex.: populares, busca ou gênero.
 */
export function useMovieFeed(initial: Loader) {
  const movies = ref<MovieSummary[]>([]);
  const loading = ref(false);
  const error = ref<string | null>(null);
  const page = ref(0);
  const totalPages = ref(1);
  const totalResults = ref(0);
  const loader = shallowRef<Loader>(initial);
  let requestId = 0;

  const hasMore = () => page.value < Math.min(totalPages.value, 500);

  async function loadMore() {
    if (loading.value || !hasMore()) return;
    loading.value = true;
    error.value = null;
    const id = requestId;
    try {
      const data = await loader.value(page.value + 1);
      if (id !== requestId) return; // a fonte mudou no meio do caminho
      const seen = new Set(movies.value.map((m) => m.id));
      movies.value.push(...data.results.filter((m) => !seen.has(m.id)));
      page.value = data.page;
      totalPages.value = data.total_pages;
      totalResults.value = data.total_results;
    } catch (e) {
      if (id === requestId) error.value = e instanceof Error ? e.message : "Algo deu errado.";
    } finally {
      if (id === requestId) loading.value = false;
    }
  }

  function reset(next: Loader) {
    requestId++;
    loader.value = next;
    movies.value = [];
    page.value = 0;
    totalPages.value = 1;
    totalResults.value = 0;
    loading.value = false;
    return loadMore();
  }

  return { movies, loading, error, totalResults, hasMore, loadMore, reset };
}
