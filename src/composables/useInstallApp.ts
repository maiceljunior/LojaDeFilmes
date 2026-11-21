import { computed, onMounted, onUnmounted, ref } from "vue";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

const isStandalone = () =>
  matchMedia("(display-mode: standalone)").matches ||
  (navigator as Navigator & { standalone?: boolean }).standalone === true;

const isIos = () => /iphone|ipad|ipod/i.test(navigator.userAgent);

/**
 * Instalação como app.
 * Android/Chrome: usa o pedido de instalação nativo.
 * iPhone: abre o passo a passo (Compartilhar → Adicionar à Tela de Início).
 */
export function useInstallApp() {
  const promptEvent = ref<BeforeInstallPromptEvent | null>(null);
  const installed = ref(isStandalone());
  const showIosTip = ref(false);

  const canInstall = computed(() => !installed.value && (promptEvent.value !== null || isIos()));

  function onPrompt(e: Event) {
    e.preventDefault();
    promptEvent.value = e as BeforeInstallPromptEvent;
  }
  function onInstalled() {
    installed.value = true;
  }

  onMounted(() => {
    window.addEventListener("beforeinstallprompt", onPrompt);
    window.addEventListener("appinstalled", onInstalled);
  });
  onUnmounted(() => {
    window.removeEventListener("beforeinstallprompt", onPrompt);
    window.removeEventListener("appinstalled", onInstalled);
  });

  async function install() {
    if (promptEvent.value) {
      await promptEvent.value.prompt();
      const { outcome } = await promptEvent.value.userChoice;
      if (outcome === "accepted") installed.value = true;
      promptEvent.value = null;
    } else {
      showIosTip.value = true;
    }
  }

  return { canInstall, install, showIosTip };
}
