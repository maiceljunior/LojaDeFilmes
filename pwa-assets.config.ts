import { defineConfig, minimal2023Preset } from "@vite-pwa/assets-generator/config";

// Gera os ícones do app a partir de public/icon.svg, com o fundo escuro da loja.
export default defineConfig({
  headLinkOptions: { preset: "2023" },
  preset: {
    ...minimal2023Preset,
    maskable: { ...minimal2023Preset.maskable, padding: 0, resizeOptions: { background: "#0a0a0f" } },
    apple: { ...minimal2023Preset.apple, padding: 0, resizeOptions: { background: "#0a0a0f" } },
  },
  images: ["public/icon.svg"],
});
