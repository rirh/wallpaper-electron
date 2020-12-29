<template>
  <ul class="home" @scroll="handleScroll" v-infinite-scroll="load">
    <li class="empty">
      &nbsp;
    </li>
    <li
      class="image-item"
      v-for="({ id, path, category, thumbs, loading }, i) in lists"
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
    <li class="empty-tips" v-show="showmore">稍等一会,美好的事情即将发生...</li>
    <li v-show="undowloading">
      <i
        @click="handleReload"
        :class="[
          're-fresh',
          loading ? 'el-icon-loading' : 'el-icon-refresh-right'
        ]"
      ></i>
    </li>
    <li class="download" v-show="!undowloading">
      <div class="contarl">
        <i class="el-icon-refresh"></i><span>重新下载</span>
        <i @click="handleCanelDowload" class="el-icon-close"></i
        ><span @click="handleCanelDowload">取消下载</span>
      </div>
      <div v-show="current > 0" class="load-bar">
        <span style="margin-right:10px">{{ current }}M/{{ total }}M</span>
      </div>
      <div
        :class="[current > 0 ? 'active-pro' : '', 'pro']"
        :style="{ width: `${(current / total) * 100}%` }"
      ></div>
    </li>
    <!-- <button @click="setWapper">setWapper</button> -->
  </ul>
</template>

<script>
const categories = [
  "last",
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
  "new",
  "why",
  "beauty",
  "sky",
  "new year",
  "sun",
  "shine",
  new Date().getFullYear()
];
// @ is an alias to /src
export default {
  name: "Home",
  data() {
    return {
      setting: false,
      loading: false,
      undowloading: true,
      total: "0",
      current: "0",
      currentImageIndex: 0,
      url: "https://f794c6c4-6af8-4d74-b405-d93ed7968c0f.bspapp.com/http/wall?",
      filterParams: {
        categories: 100,
        purity: 100,
        page: 1
      },
      showmore: true,
      lists: []
    };
  },
  components: {},
  mounted() {
    this.fetchList();
    window.ipcRenderer.on("reply-setpaper", (event, data) => {
      const { i } = data;
      this.lists[i] = { ...this.lists[i], loading: false };
    });
    window.ipcRenderer.on("reply-pro", (event, data) => {
      const { total, current } = data;
      if (total) this.total = (total / 1024 / 1000).toFixed(2);
      if (current) this.current = (current / 1024 / 1000).toFixed(2);
      this.undowloading = this.total === this.current;
    });
  },
  methods: {
    handleScroll(e) {
      if (
        e.target.scrollTop + e.target.clientHeight >=
        e.target.scrollHeight - 100
      ) {
        if (this.loading) return;
        this.filterParams.page = this.filterParams.page + 1;
        this.fetchList();
      }
    },
    errorHandler() {
      return true;
    },
    handleReload() {
      if (this.loading) return;
      this.filterParams = {
        page: 1,
        q: categories[parseInt(Math.random() * categories.length - 1, 10) + 1]
      };
      this.fetchList();
      window.ipcRenderer.send("checkForUpdate");
    },
    fetchList() {
      this.loading = true;
      // fetch(`${this.baseUri}${this.object2URL(this.filterParams)}`, {
      try {
        fetch(`${this.url}`, {
          method: "POST",
          body: JSON.stringify({
            options: {
              method: "get",
              data: this.filterParams,
              dataType: "json"
            }
          })
        })
          .then(async response => {
            this.response = await response.json();
            if (!this.response.data) return;
            const lists = this.response.data.data.map(e => ({
              ...e,
              loading: false
            }));
            if (this.filterParams.page === 1) {
              this.lists = lists;
              this.$nextTick(() => {
                document.querySelector(".empty").scrollIntoView({
                  behavior: "smooth",
                  block: "start"
                });
              });
            } else {
              this.lists = [...this.lists, ...lists];
              this.showmore =
                this.response.data.meta.total === this.lists.length
                  ? false
                  : true;
            }
            this.loading = false;
          })
          .catch(err => {
            this.loading = false;
            console.error(err);
          });
      } catch (error) {
        this.loading = false;
      }
    },
    handleSetWapper(loading, path, i) {
      if (loading) return;
      this.undowloading = false;
      this.currentImageIndex = i;
      this.lists[i] = { ...this.lists[i], loading: true };
      window.ipcRenderer.send("setpaper", { path, i });
    },
    handleCanelDowload() {
      window.ipcRenderer.send("sendCanelDowload");
      this.undowloading = true;
      this.total = null;
      this.current = null;
      this.lists[this.currentImageIndex] = {
        ...this.lists[this.currentImageIndex],
        loading: false
      };
    },
    load() {
      console.log(1);
      this.filterParams.page = this.filterParams.page + 1;
      this.fetchList();
    },
    object2URL(obj) {
      var str = [];
      for (var p in obj)
        if (Object.hasOwnProperty.call(obj, p)) {
          str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
        }
      return str.join("&");
    }
  }
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
  box-sizing: border-box;
  width: 100vw;
  overflow-x: hidden;
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
  filter: brightness(85%);
}
.image-item {
  position: relative;
}
.empty-tips {
  font-size: 14px;
  color: #999;
  padding: 20px 0px;
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
  filter: brightness(135%);
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
  bottom: 3vh;
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
.download {
  position: fixed;
  bottom: 0;
  left: 0;
  z-index: 1;
  background-color: rgba(0, 0, 0, 0.8);
  width: 100%;
  color: #eee;
  padding: 15px 0 20px;
  text-align: left;
  font-size: 12px;
  cursor: pointer;
}
.download i {
  margin: 0 12px;
  font-size: 16px;
}
.contarl {
  display: flex;
  justify-content: flex-start;
  align-items: center;
}
.pro {
  position: fixed;
  bottom: 0;
  left: 0;
  z-index: 2;
  /* height: 0px; */
  height: 5px;
  background-color: #000;
}
.load-bar {
  position: fixed;
  bottom: 7px;
  left: 0;
  z-index: 2;
  text-align: right;
  width: 100%;
  font-size: 10px;
  /* height: 0px; */
}
.active-pro {
  background-color: #409eff;
}
</style>
