<script setup lang="ts">
import { computed, ref } from "vue";
import { imageUrl } from "@/services/tmdb";
import AppIcon from "./AppIcon.vue";

const props = withDefaults(
  defineProps<{ path: string | null; alt: string; size?: "w185" | "w342" | "w500" | "w780" }>(),
  { size: "w342" },
);

const loaded = ref(false);
const failed = ref(false);
const src = computed(() => imageUrl(props.path, props.size));
</script>

<template>
  <div class="relative aspect-[2/3] overflow-hidden bg-panel-2" :class="{ skeleton: !loaded && src && !failed }">
    <img
      v-if="src && !failed"
      :src="src"
      :alt="alt"
      loading="lazy"
      decoding="async"
      class="size-full object-cover transition-opacity duration-500"
      :class="loaded ? 'opacity-100' : 'opacity-0'"
      @load="loaded = true"
      @error="failed = true"
    />
    <div v-else class="grid size-full place-items-center p-4 text-center text-muted">
      <div class="flex flex-col items-center gap-2">
        <AppIcon name="film" :size="28" />
        <span class="text-xs">{{ alt }}</span>
      </div>
    </div>
  </div>
</template>
