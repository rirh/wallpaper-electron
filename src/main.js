import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import "@/assets/styles/index.css";
// 外部引入lazyload的js文件
import lazyload from "./lazyload";

let LazyPlugin = {};

LazyPlugin.install = (Vue) => {
  Vue.directive("lazy", lazyload);
};

createApp(App)
  .use(store)
  .use(router)
  .use(LazyPlugin)
  .mount("#app");
