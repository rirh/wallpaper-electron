import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import "@/assets/styles/index.css";
import "element-plus/lib/theme-chalk/index.css";

// 外部引入lazyload的js文件
import VueLazyLoad from "vue3-lazyload";
// import NProgress from "nprogress";
import "nprogress/nprogress.css";
import { ElAvatar, ElSkeleton, ElIcon, ElInfiniteScroll } from "element-plus";
import infiniteScorll from 'vue-infinite-scroll';

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
  .use(infiniteScorll)
  .component(ElAvatar.name, ElAvatar)
  .component(ElSkeleton.name, ElSkeleton)
  .component(ElIcon.name, ElIcon)
  .component(ElInfiniteScroll.name, ElInfiniteScroll)
  .mount("#app");
