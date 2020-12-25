import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import "@/assets/styles/index.css";
// 外部引入lazyload的js文件
import VueLazyLoad from "vue3-lazyload";
// import NProgress from "nprogress";
import "nprogress/nprogress.css";

createApp(App)
  .use(store)
  .use(router)
  .use(VueLazyLoad, {
    loading: () => {
      // console.log("loading");
      // NProgress.start()
    },
    error: () => {
      // console.log("error");
      // NProgress.remove()
    },
    loaded: () => {
      // console.log("loaded");
      // NProgress.done()
    },
  })
  .mount("#app");
