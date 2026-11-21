<script setup lang="ts">
import { useIntersectionObserver } from "@vueuse/core";
import { computed, onMounted, ref, useTemplateRef, watch } from "vue";
import { useRoute } from "vue-router";
import GenreChips from "@/components/movies/GenreChips.vue";
import HeroBanner from "@/components/movies/HeroBanner.vue";
import MovieGrid from "@/components/movies/MovieGrid.vue";
import AppIcon from "@/components/ui/AppIcon.vue";
import { useMovieFeed } from "@/composables/useMovieFeed";
import { tmdb } from "@/services/tmdb";
import type { Genre } from "@/types/movie";

const route = useRoute();
const genres = ref<Genre[]>([]);
const genreId = ref<number | null>(null);
const search = computed(() => (typeof route.query.q === "string" ? route.query.q.trim() : ""));

const feed = useMovieFeed((page) => tmdb.popular(page));
const { movies, loading, error, totalResults } = feed;

// O destaque é o primeiro filme popular com imagem de fundo.
const featured = computed(() =>
  !search.value && genreId.value === null ? movies.value.find((m) => m.backdrop_path) : undefined,
);
const gridMovies = computed(() => movies.value.filter((m) => m.id !== featured.value?.id));

const title = computed(() => {
  if (search.value) return `Resultados para “${search.value}”`;
  if (genreId.value !== null) return genres.value.find((g) => g.id === genreId.value)?.name ?? "Filmes";
  return "Populares da semana";
});

function reload() {
  if (search.value) return feed.reset((page) => tmdb.search(search.value, page));
  if (genreId.value !== null) {
    const id = genreId.value;
    return feed.reset((page) => tmdb.byGenre(id, page));
  }
  return feed.reset((page) => tmdb.popular(page));
}

watch(search, (q) => {
  if (q) genreId.value = null;
  reload();
});
watch(genreId, () => {
  if (!search.value) reload();
});

onMounted(async () => {
  reload();
  genres.value = await tmdb.genres().catch(() => []);
});

// Rolagem infinita: quando o "sentinela" no fim da lista aparece, carrega mais.
const sentinel = useTemplateRef<HTMLElement>("sentinel");
useIntersectionObserver(
  sentinel,
  ([entry]) => {
    if (entry?.isIntersecting && movies.value.length) feed.loadMore();
  },
  { rootMargin: "600px" },
);
</script>

<template>
  <HeroBanner v-if="featured" :movie="featured" />
  <div v-else class="h-24" />

  <section class="mx-auto max-w-7xl px-4 pb-20 sm:px-6 lg:px-8" :class="featured ? 'pt-6' : ''">
    <div class="mb-6 flex flex-col gap-5">
      <div class="flex items-end justify-between gap-4">
        <h2 class="font-display text-3xl tracking-wide sm:text-4xl">{{ title }}</h2>
        <span v-if="search && totalResults" class="text-sm text-muted">{{ totalResults }} filmes</span>
      </div>
      <GenreChips v-if="!search && genres.length" v-model="genreId" :genres="genres" />
    </div>

    <div v-if="error && !movies.length" class="flex flex-col items-center gap-4 rounded-2xl bg-panel py-16 text-center">
      <AppIcon name="alert" :size="32" class="text-brand-soft" />
      <p class="max-w-sm text-white/80">{{ error }}</p>
      <button type="button" class="rounded-full bg-white px-5 py-2 font-semibold text-ink" @click="reload()">Tentar de novo</button>
    </div>

    <div
      v-else-if="!loading && !movies.length"
      class="flex flex-col items-center gap-3 rounded-2xl bg-panel py-16 text-center"
    >
      <AppIcon name="film" :size="32" class="text-muted" />
      <p class="text-white/80">Nenhum filme encontrado para “{{ search }}”.</p>
      <p class="text-sm text-muted">Tente outro título ou confira a grafia.</p>
    </div>

    <MovieGrid v-else :movies="gridMovies" :loading="loading" :skeletons="movies.length ? 6 : 12" />

    <div ref="sentinel" class="h-px" />
    <p v-if="error && movies.length" class="mt-8 text-center text-sm text-muted">
      {{ error }}
      <button type="button" class="ml-2 underline" @click="feed.loadMore()">Tentar de novo</button>
    </p>
  </section>
</template>
