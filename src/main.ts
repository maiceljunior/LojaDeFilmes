import { createPinia } from "pinia";
import { createApp } from "vue";
import App from "./App.vue";
import { router } from "./router";
import { blockZoomGestures } from "./utils/noZoom";
import "./styles/main.css";

blockZoomGestures();

createApp(App).use(createPinia()).use(router).mount("#app");
