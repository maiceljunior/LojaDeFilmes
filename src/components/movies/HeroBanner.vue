<script setup lang="ts">
import AppIcon from "@/components/ui/AppIcon.vue";
import RatingBadge from "@/components/ui/RatingBadge.vue";
import { useMovieActions } from "@/composables/useMovieActions";
import { imageUrl } from "@/services/tmdb";
import type { MovieSummary } from "@/types/movie";
import { formatCurrency, formatYear, moviePrice } from "@/utils/format";

defineProps<{ movie: MovieSummary }>();
const { addToCart } = useMovieActions();
</script>

<template>
  <section class="relative isolate overflow-hidden">
    <img
      v-if="movie.backdrop_path"
      :src="imageUrl(movie.backdrop_path, 'original') ?? ''"
      alt=""
      class="absolute inset-0 -z-10 size-full object-cover object-top"
    />
    <div class="absolute inset-0 -z-10 bg-gradient-to-r from-ink via-ink/80 to-ink/10" />
    <div class="absolute inset-0 -z-10 bg-gradient-to-t from-ink via-transparent to-ink/40" />

    <div class="mx-auto flex min-h-[62vh] max-w-7xl flex-col justify-end px-4 pb-14 pt-28 sm:px-6 md:min-h-[72vh] lg:px-8">
      <p class="mb-3 inline-flex w-fit items-center gap-2 rounded-full bg-brand/15 px-3 py-1 text-xs font-semibold uppercase tracking-widest text-brand-soft">
        Em alta agora
      </p>
      <h1 class="max-w-3xl font-display text-5xl leading-[0.95] tracking-wide sm:text-7xl">{{ movie.title }}</h1>
      <div class="mt-4 flex items-center gap-4 text-sm text-white/80">
        <RatingBadge :value="movie.vote_average" />
        <span>{{ formatYear(movie.release_date) }}</span>
        <span class="font-semibold text-white">{{ formatCurrency(moviePrice(movie.vote_average)) }}</span>
      </div>
      <p class="mt-4 line-clamp-3 max-w-xl text-white/75 sm:text-lg">{{ movie.overview }}</p>
      <div class="mt-7 flex flex-wrap gap-3">
        <button
          type="button"
          class="inline-flex items-center gap-2 rounded-full bg-brand px-6 py-3 font-semibold shadow-lg shadow-brand/30 transition hover:bg-brand-soft"
          @click="addToCart(movie)"
        >
          <AppIcon name="cart" :size="18" />
          Adicionar ao carrinho
        </button>
        <RouterLink
          :to="{ name: 'movie', params: { id: movie.id } }"
          class="inline-flex items-center gap-2 rounded-full bg-white/10 px-6 py-3 font-semibold backdrop-blur transition hover:bg-white/20"
        >
          <AppIcon name="info" :size="18" />
          Mais detalhes
        </RouterLink>
      </div>
    </div>
  </section>
</template>
