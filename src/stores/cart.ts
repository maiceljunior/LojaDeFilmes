import { useLocalStorage } from "@vueuse/core";
import { defineStore } from "pinia";
import { computed } from "vue";
import type { CartItem, StoredMovie } from "@/types/movie";
import { moviePrice } from "@/utils/format";

export const useCartStore = defineStore("cart", () => {
  const items = useLocalStorage<CartItem[]>("loja-filmes:cart", []);

  const count = computed(() => items.value.reduce((acc, item) => acc + item.quantity, 0));
  const total = computed(() =>
    items.value.reduce((acc, item) => acc + moviePrice(item.vote_average) * item.quantity, 0),
  );

  function has(id: number) {
    return items.value.some((item) => item.id === id);
  }

  function add(movie: StoredMovie) {
    const existing = items.value.find((item) => item.id === movie.id);
    if (existing) existing.quantity++;
    else items.value.push({ ...pick(movie), quantity: 1 });
  }

  function decrease(id: number) {
    const item = items.value.find((i) => i.id === id);
    if (!item) return;
    if (item.quantity > 1) item.quantity--;
    else remove(id);
  }

  function remove(id: number) {
    items.value = items.value.filter((item) => item.id !== id);
  }

  function clear() {
    items.value = [];
  }

  return { items, count, total, has, add, decrease, remove, clear };
});

/** Guarda só os campos usados no carrinho/favoritos. */
export function pick(movie: StoredMovie): StoredMovie {
  const { id, title, poster_path, release_date, vote_average } = movie;
  return { id, title, poster_path, release_date, vote_average };
}
