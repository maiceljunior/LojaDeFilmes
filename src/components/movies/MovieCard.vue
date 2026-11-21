<script setup lang="ts">
import AppIcon from "@/components/ui/AppIcon.vue";
import PosterImage from "@/components/ui/PosterImage.vue";
import RatingBadge from "@/components/ui/RatingBadge.vue";
import { useMovieActions } from "@/composables/useMovieActions";
import type { MovieSummary } from "@/types/movie";
import { formatCurrency, formatYear, moviePrice } from "@/utils/format";

const props = defineProps<{ movie: MovieSummary }>();
const { favorites, addToCart, toggleFavorite } = useMovieActions();
</script>

<template>
  <article class="group relative">
    <RouterLink
      :to="{ name: 'movie', params: { id: props.movie.id } }"
      class="block overflow-hidden rounded-xl ring-1 ring-white/5 transition duration-300 group-hover:-translate-y-1 group-hover:ring-white/20 group-hover:shadow-2xl group-hover:shadow-black/60"
    >
      <PosterImage :path="movie.poster_path" :alt="movie.title" />

      <!-- Camada que aparece ao passar o mouse (no celular fica sempre o rodapé) -->
      <div
        class="pointer-events-none absolute inset-x-0 bottom-0 hidden bg-gradient-to-t from-black via-black/80 to-transparent p-3 pt-16 opacity-0 transition duration-300 group-hover:opacity-100 sm:block"
      >
        <p class="line-clamp-3 text-xs leading-relaxed text-white/80">
          {{ movie.overview || "Sem sinopse disponível." }}
        </p>
      </div>
    </RouterLink>

    <button
      type="button"
      class="absolute right-2 top-2 grid size-9 place-items-center rounded-full bg-black/60 backdrop-blur transition hover:scale-110"
      :class="favorites.has(movie.id) ? 'text-brand-soft' : 'text-white/80 hover:text-white'"
      :aria-label="favorites.has(movie.id) ? 'Remover dos favoritos' : 'Adicionar aos favoritos'"
      :aria-pressed="favorites.has(movie.id)"
      @click="toggleFavorite(movie)"
    >
      <AppIcon name="heart" :filled="favorites.has(movie.id)" :size="18" />
    </button>

    <div class="mt-3 space-y-1.5">
      <RouterLink :to="{ name: 'movie', params: { id: movie.id } }" class="line-clamp-1 font-semibold hover:text-brand-soft">
        {{ movie.title }}
      </RouterLink>
      <div class="flex items-center gap-3 text-muted">
        <RatingBadge :value="movie.vote_average" class="text-white" />
        <span class="text-sm">{{ formatYear(movie.release_date) }}</span>
      </div>
      <div class="flex items-center justify-between gap-2 pt-1">
        <span class="font-semibold">{{ formatCurrency(moviePrice(movie.vote_average)) }}</span>
        <button
          type="button"
          class="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1.5 text-xs font-semibold transition hover:bg-brand"
          :aria-label="`Adicionar ${movie.title} ao carrinho`"
          @click="addToCart(movie)"
        >
          <AppIcon name="plus" :size="14" />
          Carrinho
        </button>
      </div>
    </div>
  </article>
</template>
