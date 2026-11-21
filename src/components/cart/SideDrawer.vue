<script setup lang="ts">
import { onKeyStroke, useScrollLock } from "@vueuse/core";
import { computed, watch } from "vue";
import { useRouter } from "vue-router";
import AppIcon from "@/components/ui/AppIcon.vue";
import PosterImage from "@/components/ui/PosterImage.vue";
import { useMovieActions } from "@/composables/useMovieActions";
import { useUiStore } from "@/stores/ui";
import { formatCurrency, formatYear, moviePrice } from "@/utils/format";

const ui = useUiStore();
const router = useRouter();
const { cart, favorites, addToCart } = useMovieActions();
const open = computed(() => ui.drawer !== null);

const lock = useScrollLock(typeof document !== "undefined" ? document.body : null);
watch(open, (value) => (lock.value = value));
onKeyStroke("Escape", () => ui.closeDrawer());

function goTo(id: number) {
  ui.closeDrawer();
  router.push({ name: "movie", params: { id } });
}

function checkout() {
  ui.closeDrawer();
  router.push({ name: "checkout" });
}
</script>

<template>
  <Transition enter-from-class="opacity-0" leave-to-class="opacity-0" enter-active-class="transition duration-300" leave-active-class="transition duration-200">
    <div v-if="open" class="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm" @click="ui.closeDrawer()" />
  </Transition>

  <Transition
    enter-from-class="translate-x-full"
    leave-to-class="translate-x-full"
    enter-active-class="transition duration-300 ease-out"
    leave-active-class="transition duration-200 ease-in"
  >
    <aside
      v-if="open"
      class="fixed inset-y-0 right-0 z-50 flex w-full max-w-md flex-col border-l border-white/5 bg-panel shadow-2xl"
      role="dialog"
      aria-modal="true"
      :aria-label="ui.drawer === 'cart' ? 'Carrinho' : 'Favoritos'"
    >
      <header class="flex items-center gap-2 border-b border-line p-4">
        <div class="flex flex-1 gap-1 rounded-full bg-ink p-1">
          <button
            v-for="tab in (['cart', 'favorites'] as const)"
            :key="tab"
            type="button"
            class="flex-1 rounded-full py-2 text-sm font-semibold transition"
            :class="ui.drawer === tab ? 'bg-white text-ink' : 'text-white/70 hover:text-white'"
            @click="ui.openDrawer(tab)"
          >
            {{ tab === "cart" ? `Carrinho (${cart.count})` : `Favoritos (${favorites.count})` }}
          </button>
        </div>
        <button type="button" class="grid size-10 place-items-center rounded-full hover:bg-white/10" aria-label="Fechar" @click="ui.closeDrawer()">
          <AppIcon name="close" />
        </button>
      </header>

      <!-- Carrinho -->
      <template v-if="ui.drawer === 'cart'">
        <div v-if="!cart.items.length" class="flex flex-1 flex-col items-center justify-center gap-3 p-8 text-center">
          <AppIcon name="cart" :size="40" class="text-muted" />
          <p class="font-semibold">Seu carrinho está vazio</p>
          <p class="text-sm text-muted">Escolha um filme e ele aparece aqui.</p>
        </div>

        <ul v-else class="flex-1 space-y-3 overflow-y-auto p-4">
          <li v-for="item in cart.items" :key="item.id" class="flex gap-3 rounded-xl bg-panel-2 p-2.5">
            <button type="button" class="w-16 shrink-0 overflow-hidden rounded-lg" @click="goTo(item.id)">
              <PosterImage :path="item.poster_path" :alt="item.title" size="w185" />
            </button>
            <div class="flex min-w-0 flex-1 flex-col">
              <button type="button" class="line-clamp-2 text-left text-sm font-semibold hover:text-brand-soft" @click="goTo(item.id)">
                {{ item.title }}
              </button>
              <span class="text-xs text-muted">{{ formatYear(item.release_date) }}</span>
              <div class="mt-auto flex items-center justify-between pt-2">
                <div class="flex items-center rounded-full bg-ink">
                  <button type="button" class="grid size-8 place-items-center rounded-full hover:bg-white/10" aria-label="Diminuir" @click="cart.decrease(item.id)">
                    <AppIcon :name="item.quantity > 1 ? 'minus' : 'trash'" :size="14" />
                  </button>
                  <span class="w-6 text-center text-sm font-semibold tabular-nums">{{ item.quantity }}</span>
                  <button type="button" class="grid size-8 place-items-center rounded-full hover:bg-white/10" aria-label="Aumentar" @click="cart.add(item)">
                    <AppIcon name="plus" :size="14" />
                  </button>
                </div>
                <span class="text-sm font-semibold tabular-nums">{{ formatCurrency(moviePrice(item.vote_average) * item.quantity) }}</span>
              </div>
            </div>
          </li>
        </ul>

        <footer v-if="cart.items.length" class="space-y-3 border-t border-line p-4">
          <div class="flex items-center justify-between">
            <span class="text-muted">Total</span>
            <span class="text-xl font-bold tabular-nums">{{ formatCurrency(cart.total) }}</span>
          </div>
          <button type="button" class="w-full rounded-full bg-brand py-3 font-semibold transition hover:bg-brand-soft" @click="checkout">
            Finalizar compra
          </button>
          <button type="button" class="w-full py-1 text-sm text-muted hover:text-white" @click="cart.clear()">Esvaziar carrinho</button>
        </footer>
      </template>

      <!-- Favoritos -->
      <template v-else>
        <div v-if="!favorites.items.length" class="flex flex-1 flex-col items-center justify-center gap-3 p-8 text-center">
          <AppIcon name="heart" :size="40" class="text-muted" />
          <p class="font-semibold">Nenhum favorito ainda</p>
          <p class="text-sm text-muted">Toque no coração de um filme para guardar aqui.</p>
        </div>

        <ul v-else class="flex-1 space-y-3 overflow-y-auto p-4">
          <li v-for="item in favorites.items" :key="item.id" class="flex gap-3 rounded-xl bg-panel-2 p-2.5">
            <button type="button" class="w-16 shrink-0 overflow-hidden rounded-lg" @click="goTo(item.id)">
              <PosterImage :path="item.poster_path" :alt="item.title" size="w185" />
            </button>
            <div class="flex min-w-0 flex-1 flex-col">
              <button type="button" class="line-clamp-2 text-left text-sm font-semibold hover:text-brand-soft" @click="goTo(item.id)">
                {{ item.title }}
              </button>
              <span class="text-xs text-muted">{{ formatYear(item.release_date) }} · {{ formatCurrency(moviePrice(item.vote_average)) }}</span>
              <div class="mt-auto flex items-center gap-2 pt-2">
                <button type="button" class="rounded-full bg-white/10 px-3 py-1.5 text-xs font-semibold hover:bg-brand" @click="addToCart(item)">
                  {{ cart.has(item.id) ? "Mais um no carrinho" : "Adicionar ao carrinho" }}
                </button>
                <button type="button" class="ml-auto grid size-8 place-items-center rounded-full text-muted hover:bg-white/10 hover:text-white" aria-label="Remover dos favoritos" @click="favorites.toggle(item)">
                  <AppIcon name="trash" :size="14" />
                </button>
              </div>
            </div>
          </li>
        </ul>
      </template>
    </aside>
  </Transition>
</template>
