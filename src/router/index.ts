import { createRouter, createWebHistory } from "vue-router";
import HomeView from "@/views/HomeView.vue";

export const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: "/", name: "home", component: HomeView },
    { path: "/filme/:id", name: "movie", component: () => import("@/views/MovieView.vue"), props: true },
    { path: "/checkout", name: "checkout", component: () => import("@/views/CheckoutView.vue") },
    { path: "/:pathMatch(.*)*", redirect: "/" },
  ],
  scrollBehavior(_to, _from, saved) {
    return saved ?? { top: 0 };
  },
});
