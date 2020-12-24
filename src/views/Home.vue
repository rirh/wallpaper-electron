<template>
  <div class="home">
    <div v-show="loading">稍等一会，美好的事情即将发生...</div>
    <div
      class="image-item"
      v-for="{ path, id, category } in response.data"
      :key="id"
      @click="handleSetWapper(path)"
    >
      <img ref="image" v-lazy="path" :alt="category" />
    </div>
    <!-- <button @click="setWapper">setWapper</button> -->
  </div>
</template>

<script>
// @ is an alias to /src
export default {
  name: "Home",
  data() {
    return {
      loading: false,
      baseUri: "https://wallhaven.cc/api/v1/search?",
      categories: ["常规", "动漫", "人物"],
      purity: ["SFW", "粗略", "NSFW"],
      atleast: "",
      resolutions: "",
      ratios: "",
      sorting: {
        随机: "random",
        相关: "relevance",
        上传时间: "date_added",
        查看数: "views",
        收藏数: "favorites",
        热门: "toplist",
      },
      order: { 降序: "desc", 升序: "asc" },
      topRange: {
        最近一天: "1d",
        最近三天: "3d",
        最近一周: "1w",
        最近一个月: "1M",
        最近三个月: "3M",
        最近半年: "6M",
        最近一年: "1y",
      }, // 当sorting为toplist有效
      colors: [
        "",
        "#660000",
        "#990000",
        "#cc0000",
        "#cc3333",
        "#ea4c88",
        "#993399",
        "#663399",
        "#333399",
        "#0066cc",
        "#0099cc",
        "#66cccc",
        "#77cc33",
        "#669900",
        "#336600",
        "#666600",
        "#999900",
        "#cccc33",
        "#ffff00",
        "#ffcc33",
        "#ff9900",
        "#ff6600",
        "#cc6633",
        "#996633",
        "#663300",
        "#000000",
        "#999999",
        "#cccccc",
        "#ffffff",
        "#424153",
      ],
      filterParams: {
        categories: "100",
        purity: "100",
        page: 1,
      },
      currentImage: {},
      lastListQueryParams: {},
      response: {},
    };
  },
  components: {},
  mounted() {
    this.fetchList();
    window.ipcRenderer.on("reply-setpaper", (event, data) => {
      console.log(data); //done
    });
    // console.log(window.os.homedir()    downloadImagePath: `${os.homedir()}${isWin() ? '\\Downloads\\wallpaper' : '/Downloads/wallpaper'} `,
    // );
  },
  methods: {
    fetchList() {
      this.loading = true;
      fetch(`${this.baseUri}${this.object2URL(this.filterParams)}`, {
        method: "GET",
      })
        .then(async (response) => {
          this.response = await response.json();
          this.loading = false;
        })
        .catch((err) => {
          this.loading = false;
          console.error(err);
        });
    },
    handleSetWapper(path) {
      window.ipcRenderer.send("setpaper", path);
    },
    setWapper() {
      const uri = `C:\\Users\\Administrator\\Desktop\\wallhaven-l3qmwq.jpg`;
      // const uri = '/Users/zh/Documents/images/pap.er/JsjXnWlh8-g.jpg'

      window.ipcRenderer.send("setwapper", uri);
    },
    object2URL(obj) {
      var str = [];
      for (var p in obj)
        if (Object.hasOwnProperty.call(obj, p)) {
          str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
        }
      return str.join("&");
    },
  },
};
</script>
<style scoped>
.image-item img {
  width: 100%;
}
</style>
