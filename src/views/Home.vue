<template>
  <ul class="home" @scroll="handleScroll">
    <li class="empty">&nbsp;</li>
    <li class="image-item" v-for="(item, i) in lists[cursor]" :key="item.id">
      <span
        class="setwapper"
        @click.stop="handleSetWapper(item.loading, item.urls.full, i)"
      >
        <i
          :class="item.loading ? 'el-icon-loading' : 'el-icon-monitor'"
          style="color: #fff"
        ></i>
        设为桌面
      </span>
      <lazy-avatar  :image="item.path"></lazy-avatar>
    </li>
    <li class="empty-tips" v-show="showmore">稍等一会,美好的事情即将发生...</li>
    <li v-show="undowloading">
      <i
        @click="handleReload"
        :class="[
          're-fresh',
          loading ? 'el-icon-loading' : 'el-icon-refresh-right'
        ]"
        :style="{ bottom: platform === 'darwin' ? '13px' : '4vh' }"
      ></i>
    </li>
    <li class="download" v-show="!undowloading">
      <div class="contarl">
        <i class="el-icon-refresh" @click="handleReDowload"></i>
        <span @click="handleReDowload">重新下载</span>
        <i @click="handleCanelDowload" class="el-icon-close"> </i
        ><span @click="handleCanelDowload">取消下载</span>
      </div>
      <div v-show="current > 0" class="load-bar">
        <span style="margin-right: 10px">
          {{ current }}M&nbsp;/&nbsp;{{ total }}M
        </span>
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
// @ is an alias to /src
import { mapState } from "vuex";
import store from "../electron-store";
import lazyAvatar from "@/components/LazyAvatar.vue";
const checkwapper = new Worker("../worker/checkWapper.js", {
  type: "module"
});
checkwapper.onmessage = function(e) {
  const { data } = e;
  let selectedtime = store.get("random_time");
  console.log("hometime:", selectedtime);
  if (data !== selectedtime) {
    window.ipcRenderer.send("auto-change-image", data);
  } else {
    window.ipcRenderer.send("auto-change-image-from-local");
  }
};
export default {
  name: "Home",
  components: {
    "lazy-avatar": lazyAvatar
  },
  computed: {
    ...mapState({
      cursor: state => state.cursor
    })
  },
  data() {
    return {
      platform: process.platform,
      setting: false,
      loading: false,
      undowloading: true,
      total: "0",
      current: "0",
      currentImageIndex: 0,
      url: "https://f794c6c4-6af8-4d74-b405-d93ed7968c0f.bspapp.com/http/wall?",
      bgImage:
        "https://vkceyugu.cdn.bspapp.com/VKCEYUGU-aliyun-vou8sjcjysto19584c/62d8d820-48b9-11eb-a16f-5b3e54966275.png",
      filterParams: {
        limit: 10,
        page: 1
      },
      showmore: true,
      lists: {},
      timeoutcount: 0
    };
  },
  watch: {
    cursor() {
      this.filterParams = {
        limit: 10,
        page: 1
      };

      this.fetchList();
    }
  },
  mounted() {
    window.addEventListener("visibilitychange", () => {
      if (document.visibilityState === "visible") {
        this.fetchList();
        this.auto_checkout();
      }
    });
    this.auto_checkout();
    this.fetchList();
    window.ipcRenderer.on("reply-auto-change-image", () => {
      this.auto_checkout();
    });
    window.ipcRenderer.on("reply-setpaper", (event, data) => {
      const { i } = data;
      this.lists[this.cursor][i] = {
        ...this.lists[this.cursor][i],
        loading: false
      };
      this.undowloading = true;
      if (data.state === "error") {
        new Notification("提示", {
          body: data.err
        });
      }
    });
    window.ipcRenderer.on("reply-pro", (event, data) => {
      const { total, current } = data;
      if (total) this.total = (total / 1024 / 1000).toFixed(2);
      if (current) this.current = (current / 1024 / 1000).toFixed(2);
      this.undowloading = this.total === this.current;
    });
  },
  methods: {
    auto_checkout() {
      // 自动切换壁纸
      let is_random = store.get("is_random");
      let selectedtime = store.get("random_time");
      checkwapper.postMessage({ url: this.url, is_random, selectedtime });
    },
    handleReDowload() {
      window.ipcRenderer.send("sendCanelDowload");
      this.$nextTick(() => {
        this.handleSetWapper(
          false,
          this.lists[this.cursor][this.currentImageIndex].path,
          this.currentImageIndex
        );
      });
    },
    handleGoAuth(item) {
      const { shell } = window.electron;
      shell.openExternal(item.user.links.html);
    },
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
        limit: 10
      };
      this.fetchList();
      window.ipcRenderer.send("checkForUpdate");
    },
    fetchList() {
      const cursor = this.cursor;
      const url = `${this.url}`;
      this.loading = true;
      this.filterParams.order_by = this.cursor;
      const body = JSON.stringify({
        options: {
          method: "get",
          data: this.filterParams,
          dataType: "json"
        }
      });

      // fetch(`${this.baseUri}${this.object2URL(this.filterParams)}`, {
      try {
        fetch(url, {
          method: "POST",
          body: body
        })
          .then(async response => {
            const responses = await response.json();
            if (!responses.data) {
              this.timeoutcount += 1;
              if (this.timeoutcount >= 10) return;
              this.fetchList();
              return;
            }
            this.timeoutcount = 0;
            this.response = responses;
            const lists = this.response.data.map(e => ({
              ...e,
              loading: false
            }));
            if (this.filterParams.page === 1) {
              this.lists[cursor] = lists;
              this.$nextTick(() => {
                document.querySelector(".empty").scrollIntoView({
                  behavior: "smooth",
                  block: "start"
                });
              });
            } else {
              const list = [...this.lists[cursor], ...lists];
              this.lists[cursor] = list;
            }
            this.loading = false;
          })
          .catch(err => {
            this.loading = false;
            this.timeoutcount += 1;
            if (this.timeoutcount >= 10) return;
            this.fetchList();
            console.error(err);
          });
      } catch (error) {
        this.loading = false;
      }
    },
    handleSetWapper(loading, path, i) {
      if (loading) return;
      if (!this.undowloading) {
        window.ipcRenderer.send("sendCanelDowload");
        this.lists[this.cursor][this.currentImageIndex] = {
          ...this.lists[this.cursor][this.currentImageIndex],
          loading: false
        };
      }
      this.undowloading = false;
      this.currentImageIndex = i;
      this.total = null;
      this.current = null;
      this.lists[this.cursor][i] = {
        ...this.lists[this.cursor][i],
        loading: true
      };
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
  padding: 0 2px;
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
  height: 74px;
  background: #ddd;
  width: 100%;
}
.image-item {
  position: relative;
  filter: brightness(85%);
  height: 170px;
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
  font-size: 15px;
  user-select: none;
}
.auth {
  position: absolute;
  bottom: 5px;
  opacity: 0;
  right: -7px;
  /* transform: translate(-59px); */
  transition: all 200ms ease-in-out;
  /* background-color: rgba(0, 0, 0, 0.8); */
  padding: 8px 20px;
  border-radius: 20px;
  color: #eee;
  cursor: pointer;
  font-size: 10px;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
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
.image-item:hover .auth {
  opacity: 1;
}

* {
  -webkit-overflow-scrolling: touch;
}
.re-fresh {
  position: fixed;
  left: 10px;
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
  font-size: 13px;
  cursor: pointer;
  height: 15px;
}
.download i {
  margin: 0 12px;
  font-size: 16px;
}
.contarl {
  display: flex;
  justify-content: flex-start;
  align-items: center;
  user-select: none;
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
