<template>
  <div>
    <div v-if="ismac" class="box">&nbsp;</div>
    <div
      class="app"
      :class="{ drag: !ismac }"
      :style="{ height: `calc(100vh - ${ismac ? 12 : 0}px)` }"
    >
      <div class="wapper">
        <div class="row-header">
          <span>v{{ version }}</span>
          <span :class="{ 'no-drag': !ismac }" @click="handle_quite" class="btn"
            >退出</span
          >
        </div>
        <br />
        <div class="row">
          <input
            @change="handle_start"
            v-model="start"
            type="checkbox"
            id="start"
          />
          <label for="start">开机自启</label>
        </div>
        <br />
        <div class="row">
          <input
            @change="handle_update_random"
            v-model="is_random"
            type="checkbox"
            id="start"
          />
          <label for="start">随机切换壁纸</label>
        </div>
        <br />
        <div class="no-drag">
          <select id="s" @change="handleChangeTime" v-model="selectedtime">
            <option
              label="每小时（网络随机下载）"
              :value="`net-${1000 * 60 * 60}`"
            ></option>
            <option
              label="每日（网络随机下载）"
              :value="`net-${1000 * 60 * 60 * 24}`"
            ></option>
            <option
              label="每小时（本地下载库）"
              :value="`local-${1000 * 60 * 60}`"
            ></option>
            <option
              label="每日（本地下载库）"
              :value="`local-${1000 * 60 * 60 * 24}`"
            ></option>
          </select>
        </div>
        <br />
        <br />
        <div>壁纸存储文件夹</div>
        <br />
        <div class="row" :title="path">
          <input v-model="path" class="row-input" type="text" readonly />
          <button @click="hand_select_file_dir" class="row-btn">更改</button>
        </div>
      </div>
      <!-- <hr /> -->
      <div class="end">
        <span @click="handle_officeal">官方网站</span>
        <span class="end-item" @click="handle_face_back"> 反馈建议</span>
      </div>
    </div>
  </div>
</template>

<script>
import config from "../../package.json";
import store from "../electron-store";
export default {
  data() {
    return {
      version: config.version,
      start: false,
      is_random: false,
      path: "",
      selectedtime: ""
    };
  },
  computed: {
    ismac() {
      return window.process.platform === "darwin";
    }
  },
  mounted() {
    const val = window.ipcRenderer.sendSync("update-auto-lunch-app", "");
    this.start = val;
    this.path = store.get("dowload-path");
    this.is_random = store.get("is_random");
    this.is_random = store.get("is_random");
    this.selectedtime = store.get("random_time");
  },
  methods: {
    handleChangeTime() {
      store.set("random_time", this.selectedtime);
    },
    hand_select_file_dir() {
      window.remote.dialog
        .showOpenDialog({
          properties: ["openDirectory"]
        })
        .then(result => {
          if (result.filePaths.length) {
            const [path] = result.filePaths;
            this.path = path;
            store.set("dowload-path", path);
          }
        })
        .catch(err => {
          throw err;
        });
    },
    handle_update_random() {
      store.set("is_random", this.is_random);
    },
    handle_start() {
      const val = window.ipcRenderer.sendSync(
        "update-auto-lunch-app",
        this.start
      );
      this.start = val;
    },
    handle_quite() {
      window.ipcRenderer.send("close-app");
    },
    handle_officeal() {
      window.remote.shell.openExternal("http://paper.tigerzh.com");
    },
    handle_face_back() {
      window.remote.shell.openExternal(
        "https://github.com/hiover/wallpaper-electron/issues"
      );
    }
  }
};
</script>

<style>
html,
body {
  margin: 0;
  padding: 0;
  font-family: Avenir, Helvetica, Arial, sans-serif;
}
.app {
  height: calc(100vh - 12px);
  width: 100vw;
  background-color: rgba(26, 23, 23, 0.96);
  border-radius: 5px;
  font-size: 12px;
  user-select: none;
  color: #999;
}

.drag {
  -webkit-app-region: drag;
}
.no-drag {
  -webkit-app-region: no-drag;
}
.box {
  height: 12px;
  position: relative;
}
.box::before {
  content: "";
  position: absolute;
  left: calc(50% - 16px);
  top: -16px;
  width: 0px;
  height: 0px;
  border: 16px solid transparent;
  border-bottom: 16px solid rgba(26, 23, 23, 0.96);
  z-index: -1;
}
.wapper {
  padding: 15px 20px;
  box-sizing: border-box;
}
.row-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.row {
  display: flex;
  align-items: center;
  height: 20px;
  justify-content: flex-start;
  -webkit-app-region: no-drag;
}
.btn {
  cursor: pointer;
  transition: all 200ms linear;
}
.btn:hover {
  color: #f4f4f4;
}
#s {
  background: transparent;
  color: #999;
  border: 1px solid #000;
  padding: 5px;
  font-size: 12px;
  outline: none;
  display: flex;
  justify-content: center;
  align-content: center;
  height: 30px;
  border-radius: 3px;
}
.row label {
  margin-left: 10px;
}
.row-input {
  background: transparent;
  color: #999;
  border: 1px solid #000;
  padding: 3px;
  font-size: 12px;
  margin-right: 8px;
  width: 100px;
  padding: 5px;
  border-radius: 3px;
  outline: none;
}
.row-btn {
  background: transparent;
  color: #999;
  border-radius: 5px;
  box-shadow: none;
  outline: none;
  font-size: 12px;
  /* border: 1px solid #000; */
}
.end {
  bottom: 0;
  width: 100%;
  position: absolute;
  display: flex;
  justify-content: space-around;
  align-items: center;
  height: 35px;
  border-top: 1px solid rgb(41, 40, 40);
  -webkit-app-region: no-drag;
}
.end span {
  flex: 1;
  text-align: center;
  height: 100%;
  display: grid;
  place-items: center;
  cursor: pointer;
}
.end-item {
  display: flex;
}
.end span:hover {
  color: #f4f4f4;
}
</style>
