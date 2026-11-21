<script setup lang="ts">
import { useWindowScroll } from "@vueuse/core";
import { computed } from "vue";
import AppIcon from "@/components/ui/AppIcon.vue";
import { useCartStore } from "@/stores/cart";
import { useFavoritesStore } from "@/stores/favorites";
import { useUiStore } from "@/stores/ui";
import InstallButton from "./InstallButton.vue";
import SearchBar from "./SearchBar.vue";

const cart = useCartStore();
const favorites = useFavoritesStore();
const ui = useUiStore();
const { y } = useWindowScroll();
const scrolled = computed(() => y.value > 24);
</script>

<template>
  <header
    class="fixed inset-x-0 top-0 z-40 transition duration-300"
    :class="scrolled ? 'border-b border-white/5 bg-ink/85 backdrop-blur-xl' : 'bg-gradient-to-b from-ink/90 to-transparent'"
  >
    <div class="mx-auto flex h-16 max-w-7xl items-center gap-3 px-4 sm:gap-6 sm:px-6 lg:px-8">
      <RouterLink to="/" class="flex shrink-0 items-center gap-2" aria-label="Loja de Filmes — início">
        <span class="grid size-9 place-items-center rounded-lg bg-brand font-display text-xl tracking-wide">LF</span>
        <span class="hidden font-display text-2xl tracking-wider sm:block">Loja de Filmes</span>
      </RouterLink>

      <div class="min-w-0 flex-1 sm:max-w-md md:ml-auto">
        <SearchBar />
      </div>

      <nav class="flex shrink-0 items-center gap-1">
        <InstallButton />
        <button
          type="button"
          class="relative grid size-11 place-items-center rounded-full text-white/85 transition hover:bg-white/10 hover:text-white"
          aria-label="Abrir favoritos"
          @click="ui.openDrawer('favorites')"
        >
          <AppIcon name="heart" />
          <span
            v-if="favorites.count"
            class="absolute right-1 top-1 grid min-w-5 place-items-center rounded-full bg-white px-1 text-[11px] font-bold text-ink"
          >
            {{ favorites.count }}
          </span>
        </button>
        <button
          type="button"
          class="relative grid size-11 place-items-center rounded-full text-white/85 transition hover:bg-white/10 hover:text-white"
          aria-label="Abrir carrinho"
          @click="ui.openDrawer('cart')"
        >
          <AppIcon name="cart" />
          <span
            v-if="cart.count"
            :key="cart.count"
            class="absolute right-1 top-1 grid min-w-5 animate-[ping_0.4s_ease-out_1_reverse] place-items-center rounded-full bg-brand px-1 text-[11px] font-bold"
          >
            {{ cart.count }}
          </span>
        </button>
      </nav>
    </div>
  </header>
</template>
