<template>
  <div>
    <div class="box">&nbsp;</div>
    <div class="app">
      <div class="wapper">
        <div class="row-header">
          <span>v{{ version }}</span>
          <span @click="handle_quite" class="btn">退出</span>
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
        <div>
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
        <div>
          壁纸存储文件夹
        </div>
        <br />
        <div class="row" :title="path">
          <input v-model="path" class="row-input" type="text" readonly />
          <button @click="hand_select_file_dir" class="row-btn">更改</button>
        </div>
      </div>
      <!-- <hr /> -->
      <div class="end">
        <span>关于我们</span>
        <span class="end-item" @click="handle_face_back">
          <!-- <svg
            t="1611921350774"
            class="icon"
            viewBox="0 0 1024 1024"
            version="1.1"
            xmlns="http://www.w3.org/2000/svg"
            p-id="3317"
            width="10"
            height="10"
          >
            <path
              d="M244.869565 17.808696l0 313.878261-244.869565 0 0 491.965217c0 89.043478 64.556522 162.504348 146.921739 178.086957 4.452174 2.226087 11.130435 4.452174 15.582609 4.452174 2.226087 0 6.678261 0 8.904348 0 2.226087 0 6.678261 0 8.904348 0l251.547826 0 22.26087 0 387.33913 0c100.173913 0 180.313043-80.13913 180.313043-180.313043L1021.773913 17.808696 244.869565 17.808696zM84.591304 825.878261 84.591304 416.278261 244.869565 416.278261l0 409.6c0 46.747826-22.26087 91.269565-71.234783 95.721739C122.434783 917.147826 84.591304 874.852174 84.591304 825.878261zM939.408696 825.878261c0 53.426087-44.521739 97.947826-97.947826 97.947826L454.121739 923.826087l-22.26087 0-129.113043 0c15.582609-26.713043 24.486957-60.104348 24.486957-97.947826L327.234783 102.4l612.173913 0L939.408696 825.878261z"
              p-id="3318"
              fill="#999999"
            ></path>
            <path
              d="M454.121739 805.843478 823.652174 805.843478c22.26087 0 42.295652-17.808696 42.295652-42.295652 0-22.26087-17.808696-42.295652-42.295652-42.295652L454.121739 721.252174c-22.26087 0-42.295652 17.808696-42.295652 42.295652C411.826087 785.808696 431.86087 805.843478 454.121739 805.843478z"
              p-id="3319"
              fill="#999999"
            ></path>
            <path
              d="M454.121739 629.982609 823.652174 629.982609c22.26087 0 42.295652-17.808696 42.295652-42.295652 0-22.26087-17.808696-42.295652-42.295652-42.295652L454.121739 545.391304c-22.26087 0-42.295652 17.808696-42.295652 42.295652C411.826087 609.947826 431.86087 629.982609 454.121739 629.982609z"
              p-id="3320"
              fill="#999999"
            ></path>
            <path
              d="M454.121739 451.895652 823.652174 451.895652c22.26087 0 42.295652-17.808696 42.295652-42.295652 0-22.26087-17.808696-42.295652-42.295652-42.295652L454.121739 367.304348c-22.26087 0-42.295652 17.808696-42.295652 42.295652C411.826087 434.086957 431.86087 451.895652 454.121739 451.895652z"
              p-id="3321"
              fill="#999999"
            ></path>
            <path
              d="M454.121739 276.034783 823.652174 276.034783c22.26087 0 42.295652-17.808696 42.295652-42.295652S848.13913 193.669565 823.652174 193.669565L454.121739 193.669565c-22.26087 0-42.295652 17.808696-42.295652 42.295652S431.86087 276.034783 454.121739 276.034783z"
              p-id="3322"
              fill="#999999"
            ></path>
          </svg> -->
          反馈建议</span
        >
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
          console.log(err);
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
