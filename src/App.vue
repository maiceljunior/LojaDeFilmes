<script setup lang="ts">
import SideDrawer from "@/components/cart/SideDrawer.vue";
import AppHeader from "@/components/layout/AppHeader.vue";
import ToastStack from "@/components/layout/ToastStack.vue";
</script>

<template>
  <AppHeader />
  <main class="min-h-dvh">
    <RouterView v-slot="{ Component, route }">
      <Transition
        mode="out-in"
        enter-from-class="opacity-0"
        leave-to-class="opacity-0"
        enter-active-class="transition duration-200"
        leave-active-class="transition duration-150"
      >
        <component :is="Component" :key="route.name === 'home' ? 'home' : route.fullPath" />
      </Transition>
    </RouterView>
  </main>

  <footer class="border-t border-white/5 py-8 text-center text-xs text-muted">
    Dados e imagens fornecidos pelo
    <a href="https://www.themoviedb.org/" target="_blank" rel="noopener" class="underline hover:text-white">TMDB</a>.
    Projeto de estudo, sem vendas reais.
  </footer>

  <SideDrawer />
  <ToastStack />
</template>
