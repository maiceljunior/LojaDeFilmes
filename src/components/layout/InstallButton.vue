<script setup lang="ts">
import { useInstallApp } from "@/composables/useInstallApp";

const { canInstall, install, showIosTip } = useInstallApp();
</script>

<template>
  <button
    v-if="canInstall"
    type="button"
    class="flex h-9 shrink-0 items-center gap-1.5 rounded-full bg-brand px-3 text-xs font-semibold transition hover:bg-brand-soft"
    aria-label="Instalar a Loja de Filmes como app"
    @click="install"
  >
    <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
      <path d="M12 3v12M7 10l5 5 5-5M5 21h14" />
    </svg>
    <span class="hidden sm:inline">Instalar app</span>
  </button>

  <Teleport to="body">
    <Transition enter-from-class="opacity-0" leave-to-class="opacity-0" enter-active-class="transition duration-200" leave-active-class="transition duration-150">
      <div v-if="showIosTip" class="fixed inset-0 z-[70] flex items-end justify-center bg-black/75 p-4" @click="showIosTip = false">
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="ios-tip-title"
          class="w-full max-w-sm rounded-3xl bg-panel p-6 text-center shadow-2xl"
          @click.stop
        >
          <span class="mx-auto grid size-12 place-items-center rounded-xl bg-brand font-display text-2xl">LF</span>
          <h2 id="ios-tip-title" class="mt-3 font-display text-3xl tracking-wide">Instale no iPhone</h2>
          <ol class="mt-4 space-y-3 text-left text-white/85">
            <li>1. Toque em <strong>Compartilhar</strong> <span class="rounded bg-white/10 px-1.5">⬆︎</span> na barra do Safari.</li>
            <li>2. Escolha <strong>Adicionar à Tela de Início</strong>.</li>
            <li>3. Pronto: a loja abre em tela cheia, como um app.</li>
          </ol>
          <button type="button" class="mt-6 w-full rounded-full bg-white py-3 font-semibold text-ink" @click="showIosTip = false">
            Entendi
          </button>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>
