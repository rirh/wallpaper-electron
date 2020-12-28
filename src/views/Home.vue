<template>
  <ul
    class="home"
    v-infinite-scroll="load"
    :infinite-scroll-distance="100"
    @scroll="handleScroll"
  >
    <li class="empty">
      &nbsp;
    </li>
    <li
      class="image-item"
      v-for="({ path, id, category, thumbs, loading }, i) in lists"
      :key="id"
    >
      <span class="setwapper" @click.stop="handleSetWapper(loading, path, i)">
        <i
          :class="loading ? 'el-icon-loading' : 'el-icon-monitor'"
          style="color:#fff"
        ></i>
        设为桌面</span
      >

      <el-avatar
        fit="cover"
        :alt="category"
        class="avatar"
        :src="thumbs.small"
        shape="square"
        @error="errorHandler"
      >
        <img
          src="https://vkceyugu.cdn.bspapp.com/VKCEYUGU-aliyun-vou8sjcjysto19584c/62d8d820-48b9-11eb-a16f-5b3e54966275.png"
        />
      </el-avatar>
    </li>
    <li v-show="loading" class="empty-tips">稍等一会，美好的事情即将发生...</li>
    <li>
      <i
        @click="handleReload"
        :class="[
          're-fresh',
          loading ? 'el-icon-loading' : 'el-icon-refresh-right',
        ]"
      ></i>
    </li>
    <!-- <button @click="setWapper">setWapper</button> -->
  </ul>
</template>

<script>
const categories = [
  "people",
  "top",
  "card",
  "flower",
  "happy",
  "sad",
  "house",
  "lake",
  "girl",
  "boy",
];
// @ is an alias to /src
export default {
  name: "Home",
  data() {
    return {
      setting: false,
      loading: false,
      url: "https://f794c6c4-6af8-4d74-b405-d93ed7968c0f.bspapp.com/http/wall?",
      filterParams: {
        categories: 100,
        purity: 100,
        page: 1,
      },

      lists: [],
    };
  },
  components: {},
  mounted() {
    this.fetchList();
    window.ipcRenderer.on("reply-setpaper", (event, data) => {
      const { i } = data;
      this.lists[i] = { ...this.lists[i], loading: false };
    });
  },
  methods: {
    handleScroll(e) {
      console.log(e);
    },
    errorHandler() {
      return true;
    },
    handleReload() {
      this.filterParams = {
        page: 1,
        q: categories[parseInt(Math.random() * categories.length - 1, 10) + 1],
      };
      this.fetchList();
    },
    fetchList() {
      this.loading = true;
      // fetch(`${this.baseUri}${this.object2URL(this.filterParams)}`, {
      fetch(`${this.url}`, {
        method: "POST",
        body: JSON.stringify({
          options: {
            method: "get",
            data: this.filterParams,
            dataType: "json",
          },
        }),
      })
        .then(async (response) => {
          console.log(response);
          this.response = await response.json();
          const lists = this.response.data.data.map((e) => ({
            ...e,
            loading: false,
          }));
          if (this.filterParams.page === 1) {
            this.lists = lists;
          } else {
            this.lists = [...this.lists, ...lists];
          }
          this.loading = false;
        })
        .catch((err) => {
          this.loading = false;
          console.error(err);
        });
    },
    handleSetWapper(loading, path, i) {
      if (loading) return;
      this.lists[i] = { ...this.lists[i], loading: true };
      window.ipcRenderer.send("setpaper", { path, i });
    },
    load() {
      console.log(1);
      this.filterParams.page = this.filterParams.page + 1;
      this.fetchList();
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
<style>
ul {
  padding: 0px;
  margin: 0px;
}
ul li {
  list-style: none;
  padding: 0 5px;
  margin: 0px;
}
.home {
  height: calc(100vh - 12px);
  overflow-y: auto;
}
.empty {
  height: 60px;
  background: #ddd;
  width: 100%;
}
.image-item img {
  width: 100%;
  height: 150px;
  /* cursor: pointer; */
}
.image-item {
  position: relative;
  filter: brightness(95%);
}
.image-item {
  position: relative;
}
.empty-tips {
  font-size: 16px;
  color: #999;
}
.setwapper {
  position: absolute;
  top: 50%;
  opacity: 0;
  left: 50%;
  transform: translate(-47px, -50%);
  transition: all 200ms ease-in-out;
  background-color: rgba(0, 0, 0, 0.8);
  padding: 8px 20px;
  border-radius: 20px;
  color: #eee;
  cursor: pointer;
  font-size: 14px;
  user-select: none;
}
.setwapper:hover {
  background-color: rgba(0, 0, 0, 0.6);
}

.image-item:hover {
  filter: brightness(105%);
}
.image-item:hover .setwapper {
  opacity: 1;
}
.avatar,
.avatar > img {
  height: 150px !important;
  width: 100% !important;
}

* {
  -webkit-overflow-scrolling: touch;
}
.re-fresh {
  position: fixed;
  left: 10px;
  bottom: 10px;
  z-index: 1;
  font-size: 24px;
  color: #ddd;
  cursor: pointer;
  transition: all 200ms ease-in-out;
  background-color: rgba(0, 0, 0, 0.8);
  padding: 5px;
  border-radius: 50%;
}
.re-fresh:hover {
  color: #fff;
  background-color: rgba(0, 0, 0, 0.6);
}
</style>
