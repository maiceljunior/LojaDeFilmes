import { useLocalStorage } from "@vueuse/core";
import { defineStore } from "pinia";
import { computed } from "vue";
import type { StoredMovie } from "@/types/movie";
import { pick } from "./cart";

export const useFavoritesStore = defineStore("favorites", () => {
  const items = useLocalStorage<StoredMovie[]>("loja-filmes:favorites", []);

  const count = computed(() => items.value.length);

  function has(id: number) {
    return items.value.some((item) => item.id === id);
  }

  /** Adiciona ou remove; devolve true se o filme ficou nos favoritos. */
  function toggle(movie: StoredMovie): boolean {
    if (has(movie.id)) {
      items.value = items.value.filter((item) => item.id !== movie.id);
      return false;
    }
    items.value.unshift(pick(movie));
    return true;
  }

  function clear() {
    items.value = [];
  }

  return { items, count, has, toggle, clear };
});
