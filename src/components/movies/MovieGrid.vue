<script setup lang="ts">
import type { MovieSummary } from "@/types/movie";
import MovieCard from "./MovieCard.vue";

defineProps<{ movies: MovieSummary[]; loading?: boolean; skeletons?: number }>();
</script>

<template>
  <ul class="grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
    <li v-for="movie in movies" :key="movie.id">
      <MovieCard :movie="movie" />
    </li>
    <template v-if="loading">
      <li v-for="n in skeletons ?? 12" :key="`s${n}`" aria-hidden="true">
        <div class="skeleton aspect-[2/3] rounded-xl" />
        <div class="skeleton mt-3 h-4 w-3/4 rounded" />
        <div class="skeleton mt-2 h-3 w-1/3 rounded" />
      </li>
    </template>
  </ul>
</template>
