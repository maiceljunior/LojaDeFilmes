<script setup lang="ts">
defineProps<{ label: string; id: string; error?: string; hint?: string }>();
</script>

<template>
  <div class="flex flex-col gap-1.5">
    <label :for="id" class="text-sm font-medium text-white/80">{{ label }}</label>
    <slot />
    <p v-if="error" :id="`${id}-error`" class="text-xs text-brand-soft">{{ error }}</p>
    <p v-else-if="hint" class="text-xs text-muted">{{ hint }}</p>
  </div>
</template>
