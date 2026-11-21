<script setup lang="ts">
import AppIcon from "@/components/ui/AppIcon.vue";
import { useUiStore } from "@/stores/ui";

const ui = useUiStore();
</script>

<template>
  <div class="pointer-events-none fixed inset-x-0 bottom-4 z-[60] flex flex-col items-center gap-2 px-4" aria-live="polite">
    <TransitionGroup
      enter-from-class="translate-y-4 opacity-0"
      leave-to-class="translate-y-2 opacity-0"
      enter-active-class="transition duration-300"
      leave-active-class="transition duration-200"
    >
      <button
        v-for="toast in ui.toasts"
        :key="toast.id"
        type="button"
        class="pointer-events-auto flex max-w-md items-center gap-3 rounded-full border border-white/10 bg-panel-2/95 px-4 py-2.5 text-sm shadow-2xl backdrop-blur"
        @click="ui.dismiss(toast.id)"
      >
        <span
          class="grid size-6 shrink-0 place-items-center rounded-full"
          :class="toast.tone === 'success' ? 'bg-emerald-500/20 text-emerald-400' : toast.tone === 'error' ? 'bg-brand/20 text-brand-soft' : 'bg-white/10 text-white/70'"
        >
          <AppIcon :name="toast.tone === 'error' ? 'alert' : toast.tone === 'success' ? 'check' : 'info'" :size="14" />
        </span>
        <span class="line-clamp-1 text-left">{{ toast.message }}</span>
      </button>
    </TransitionGroup>
  </div>
</template>
