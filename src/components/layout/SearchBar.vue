<script setup lang="ts">
import { watchDebounced } from "@vueuse/core";
import { ref, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import AppIcon from "@/components/ui/AppIcon.vue";

const route = useRoute();
const router = useRouter();
const query = ref(typeof route.query.q === "string" ? route.query.q : "");

// Mantém o campo em sincronia com a URL (ex.: botão voltar do navegador).
watch(
  () => route.query.q,
  (q) => {
    const value = typeof q === "string" ? q : "";
    if (value !== query.value.trim()) query.value = value;
  },
);

// Busca enquanto digita, esperando a pessoa parar por um instante.
watchDebounced(
  query,
  (value) => {
    const q = value.trim();
    const current = typeof route.query.q === "string" ? route.query.q : "";
    if (q === current) return;
    router.replace({ name: "home", query: q ? { q } : {} });
  },
  { debounce: 400 },
);

function clear() {
  query.value = "";
}
</script>

<template>
  <form role="search" class="relative w-full" @submit.prevent>
    <AppIcon name="search" :size="18" class="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-muted" />
    <input
      v-model="query"
      type="search"
      placeholder="Buscar filmes…"
      aria-label="Buscar filmes"
      class="h-11 w-full rounded-full border border-line bg-panel pl-11 pr-10 text-base outline-none transition placeholder:text-muted focus:border-white/30 focus:bg-panel-2 sm:text-sm"
    />
    <button
      v-if="query"
      type="button"
      aria-label="Limpar busca"
      class="absolute right-3 top-1/2 grid size-7 -translate-y-1/2 place-items-center rounded-full text-muted hover:text-white"
      @click="clear"
    >
      <AppIcon name="close" :size="16" />
    </button>
  </form>
</template>
