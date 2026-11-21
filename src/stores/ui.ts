import { defineStore } from "pinia";
import { ref } from "vue";

export type Drawer = "cart" | "favorites" | null;

export interface Toast {
  id: number;
  message: string;
  tone: "success" | "info" | "error";
}

/** Estado de interface: painel lateral aberto e avisos (toasts). */
export const useUiStore = defineStore("ui", () => {
  const drawer = ref<Drawer>(null);
  const toasts = ref<Toast[]>([]);
  let nextId = 0;

  function openDrawer(which: Exclude<Drawer, null>) {
    drawer.value = which;
  }

  function closeDrawer() {
    drawer.value = null;
  }

  function notify(message: string, tone: Toast["tone"] = "success") {
    const id = ++nextId;
    toasts.value.push({ id, message, tone });
    setTimeout(() => dismiss(id), 2800);
  }

  function dismiss(id: number) {
    toasts.value = toasts.value.filter((t) => t.id !== id);
  }

  return { drawer, toasts, openDrawer, closeDrawer, notify, dismiss };
});
