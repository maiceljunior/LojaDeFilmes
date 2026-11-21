<script setup lang="ts">
import { formatRating } from "@/utils/format";
import AppIcon from "./AppIcon.vue";

defineProps<{ value: number }>();
</script>

<template>
  <span class="inline-flex items-center gap-1 text-sm font-semibold">
    <AppIcon name="star" filled :size="14" class="text-gold" />
    {{ value ? formatRating(value) : "—" }}
  </span>
</template>
