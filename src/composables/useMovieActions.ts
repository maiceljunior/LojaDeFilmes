import { useCartStore } from "@/stores/cart";
import { useFavoritesStore } from "@/stores/favorites";
import { useUiStore } from "@/stores/ui";
import type { StoredMovie } from "@/types/movie";

/** Ações de carrinho e favoritos já com o aviso na tela. */
export function useMovieActions() {
  const cart = useCartStore();
  const favorites = useFavoritesStore();
  const ui = useUiStore();

  function addToCart(movie: StoredMovie) {
    cart.add(movie);
    ui.notify(`"${movie.title}" foi para o carrinho`);
  }

  function toggleFavorite(movie: StoredMovie) {
    const added = favorites.toggle(movie);
    ui.notify(added ? `"${movie.title}" nos favoritos` : `"${movie.title}" saiu dos favoritos`, added ? "success" : "info");
  }

  return { cart, favorites, addToCart, toggleFavorite };
}
