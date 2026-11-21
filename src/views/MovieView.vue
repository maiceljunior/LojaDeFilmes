<script setup lang="ts">
import { computed, onMounted, ref } from "vue";
import { useRouter } from "vue-router";
import AppIcon from "@/components/ui/AppIcon.vue";
import PosterImage from "@/components/ui/PosterImage.vue";
import RatingBadge from "@/components/ui/RatingBadge.vue";
import { useMovieActions } from "@/composables/useMovieActions";
import { imageUrl, tmdb } from "@/services/tmdb";
import type { MovieDetails } from "@/types/movie";
import { formatCurrency, formatDate, formatRuntime, moviePrice } from "@/utils/format";

const props = defineProps<{ id: string }>();
const router = useRouter();
const { cart, favorites, addToCart, toggleFavorite } = useMovieActions();

const movie = ref<MovieDetails | null>(null);
const error = ref<string | null>(null);

const cast = computed(() => movie.value?.credits?.cast.slice(0, 12) ?? []);
const trailer = computed(() =>
  movie.value?.videos?.results.find((v) => v.site === "YouTube" && v.type === "Trailer"),
);

onMounted(async () => {
  try {
    movie.value = await tmdb.details(Number(props.id));
    document.title = `${movie.value.title} · Loja de Filmes`;
  } catch (e) {
    error.value = e instanceof Error ? e.message : "Não foi possível carregar o filme.";
  }
});

function back() {
  if (window.history.state?.back) router.back();
  else router.push({ name: "home" });
}
</script>

<template>
  <div v-if="error" class="mx-auto flex max-w-md flex-col items-center gap-4 px-4 pt-40 text-center">
    <AppIcon name="alert" :size="32" class="text-brand-soft" />
    <p>{{ error }}</p>
    <RouterLink to="/" class="rounded-full bg-white px-5 py-2 font-semibold text-ink">Voltar ao início</RouterLink>
  </div>

  <!-- Carregando -->
  <div v-else-if="!movie" class="mx-auto max-w-7xl px-4 pt-28 sm:px-6 lg:px-8" aria-busy="true">
    <div class="grid gap-8 md:grid-cols-[280px_1fr]">
      <div class="skeleton mx-auto aspect-[2/3] w-56 rounded-2xl md:w-full" />
      <div class="space-y-4">
        <div class="skeleton h-12 w-2/3 rounded" />
        <div class="skeleton h-4 w-1/3 rounded" />
        <div class="skeleton h-24 w-full rounded" />
      </div>
    </div>
  </div>

  <article v-else>
    <div class="relative isolate">
      <img
        v-if="movie.backdrop_path"
        :src="imageUrl(movie.backdrop_path, 'original') ?? ''"
        alt=""
        class="absolute inset-0 -z-10 h-[70vh] w-full object-cover object-top opacity-40"
      />
      <div class="absolute inset-x-0 top-0 -z-10 h-[70vh] bg-gradient-to-b from-ink/30 via-ink/70 to-ink" />

      <div class="mx-auto max-w-7xl px-4 pb-16 pt-24 sm:px-6 lg:px-8">
        <button type="button" class="mb-6 inline-flex items-center gap-1 text-sm text-white/70 hover:text-white" @click="back">
          <AppIcon name="back" :size="16" /> Voltar
        </button>

        <div class="grid gap-8 md:grid-cols-[280px_1fr] md:gap-12">
          <div class="mx-auto w-56 overflow-hidden rounded-2xl shadow-2xl shadow-black/60 ring-1 ring-white/10 md:w-full">
            <PosterImage :path="movie.poster_path" :alt="movie.title" size="w500" />
          </div>

          <div>
            <h1 class="font-display text-5xl leading-none tracking-wide sm:text-6xl">{{ movie.title }}</h1>
            <p v-if="movie.tagline" class="mt-3 italic text-white/60">“{{ movie.tagline }}”</p>

            <div class="mt-5 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-white/80">
              <RatingBadge :value="movie.vote_average" />
              <span>{{ formatDate(movie.release_date) }}</span>
              <span v-if="movie.runtime" class="inline-flex items-center gap-1">
                <AppIcon name="clock" :size="14" /> {{ formatRuntime(movie.runtime) }}
              </span>
            </div>

            <div class="mt-4 flex flex-wrap gap-2">
              <span v-for="genre in movie.genres" :key="genre.id" class="rounded-full border border-white/15 px-3 py-1 text-xs">
                {{ genre.name }}
              </span>
            </div>

            <p class="mt-6 max-w-2xl leading-relaxed text-white/80">{{ movie.overview || "Sem sinopse em português." }}</p>

            <div class="mt-8 flex flex-wrap items-center gap-3">
              <span class="mr-2 text-3xl font-bold">{{ formatCurrency(moviePrice(movie.vote_average)) }}</span>
              <button
                type="button"
                class="inline-flex items-center gap-2 rounded-full bg-brand px-6 py-3 font-semibold shadow-lg shadow-brand/30 transition hover:bg-brand-soft"
                @click="addToCart(movie)"
              >
                <AppIcon name="cart" :size="18" />
                {{ cart.has(movie.id) ? "Adicionar mais um" : "Adicionar ao carrinho" }}
              </button>
              <button
                type="button"
                class="grid size-12 place-items-center rounded-full bg-white/10 transition hover:bg-white/20"
                :class="favorites.has(movie.id) ? 'text-brand-soft' : ''"
                :aria-label="favorites.has(movie.id) ? 'Remover dos favoritos' : 'Adicionar aos favoritos'"
                :aria-pressed="favorites.has(movie.id)"
                @click="toggleFavorite(movie)"
              >
                <AppIcon name="heart" :filled="favorites.has(movie.id)" />
              </button>
              <a
                v-if="trailer"
                :href="`https://www.youtube.com/watch?v=${trailer.key}`"
                target="_blank"
                rel="noopener"
                class="inline-flex items-center gap-2 rounded-full bg-white/10 px-5 py-3 font-semibold transition hover:bg-white/20"
              >
                <AppIcon name="play" :size="16" filled /> Trailer
              </a>
            </div>
          </div>
        </div>

        <section v-if="cast.length" class="mt-14">
          <h2 class="mb-4 font-display text-3xl tracking-wide">Elenco</h2>
          <!-- Celular: rola para o lado. Telas maiores: grade, sem cortar ninguém. -->
          <ul
            class="scrollbar-none -mx-4 flex snap-x gap-4 overflow-x-auto px-4 pb-2 sm:mx-0 sm:grid sm:grid-cols-4 sm:gap-x-4 sm:gap-y-6 sm:overflow-visible sm:px-0 md:grid-cols-6"
          >
            <li v-for="person in cast" :key="person.id" class="w-28 shrink-0 snap-start sm:w-auto">
              <div class="aspect-[2/3] overflow-hidden rounded-xl bg-panel-2">
                <img
                  v-if="person.profile_path"
                  :src="imageUrl(person.profile_path, 'w185') ?? ''"
                  :alt="person.name"
                  loading="lazy"
                  class="size-full object-cover"
                />
              </div>
              <p class="mt-2 line-clamp-2 text-sm font-semibold leading-snug" :title="person.name">{{ person.name }}</p>
              <p class="line-clamp-2 text-xs text-muted" :title="person.character">{{ person.character }}</p>
            </li>
          </ul>
        </section>
      </div>
    </div>
  </article>
</template>
