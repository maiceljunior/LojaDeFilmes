<script setup lang="ts">
import type { Genre } from "@/types/movie";

defineProps<{ genres: Genre[] }>();
const selected = defineModel<number | null>({ default: null });
</script>

<template>
  <div class="scrollbar-none -mx-4 flex gap-2 overflow-x-auto px-4 pb-1 sm:mx-0 sm:flex-wrap sm:px-0">
    <button
      type="button"
      class="shrink-0 rounded-full px-4 py-2 text-sm font-medium transition"
      :class="selected === null ? 'bg-white text-ink' : 'bg-panel-2 text-white/80 hover:bg-line'"
      @click="selected = null"
    >
      Populares
    </button>
    <button
      v-for="genre in genres"
      :key="genre.id"
      type="button"
      class="shrink-0 rounded-full px-4 py-2 text-sm font-medium transition"
      :class="selected === genre.id ? 'bg-white text-ink' : 'bg-panel-2 text-white/80 hover:bg-line'"
      @click="selected = genre.id"
    >
      {{ genre.name }}
    </button>
  </div>
</template>
