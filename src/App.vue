<template>
  <div class="app-main">
    <div class="box" v-if="ismac"></div>
    <div class="contant">
      <div
        class="header"
        :style="{ top: ismac ? '10px' : 0 }"
        :class="{ drag: !ismac }"
      >
        <div class="bg"></div>
        <div class="tags no-drag">
          <div
            @click="$store.commit('updateCursor', 'latest')"
            :class="['tag-item', cursor === 'latest' ? 'tag-item-active' : '']"
          >
            最新
          </div>
          <div
            @click="$store.commit('updateCursor', 'popular')"
            :class="['tag-item', cursor === 'popular' ? 'tag-item-active' : '']"
          >
            最热
          </div>
          <div
            @click="$store.commit('updateCursor', 'oldest')"
            :class="['tag-item', cursor === 'oldest' ? 'tag-item-active' : '']"
          >
            经典
          </div>
        </div>
        <i
          v-show="false"
          class="setting el-icon-setting"
          @click="handleOpenSettingPage"
        ></i>
      </div>
      <router-view />
    </div>
  </div>
</template>
<script>
import { mapState } from "vuex";
export default {
  computed: {
    ...mapState({
      cursor: state => state.cursor
    }),
    ismac() {
      return window.process.platform === "darwin";
    }
  },
  methods: {
    handleOpenSettingPage() {
      window.ipcRenderer.send("opensettingpage");
    }
  }
};
</script>

<style scoped>
.app-main {
  position: relative;
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
  border-bottom: 16px solid black;
  z-index: -1;
}
.contant {
  height: calc(100vh - 12px);
  width: 100vw;
  overflow-y: scroll;
  overflow-x: hidden;
  border-radius: 5px;
  background-color: #0F131C;
}
.header {
  position: fixed;
  top: 10px;
  left: 0;
  border-top-right-radius: 5px;
  border-top-left-radius: 5px;
  padding: 10px;
  /* background-color: black; */
  color: rgba(255, 255, 255, 1);
  width: 93%;
  background-image: url("./assets/wall.paper.png");
  background-size: cover;
  background-repeat: no-repeat;
  height: 55px;
  background-position: 40% 0%;
  z-index: 1;
  border-bottom: 1px solid #0F131C;
}
.setting {
  position: absolute;
  right: 15px;
  top: 20px;
  color: rgba(255, 255, 255, 0.6);
  font-size: 20px;
  cursor: pointer;
  transition: all 200ms ease-in-out;
}
.setting:hover {
  color: rgba(255, 255, 255, 0.7);
}
.tags {
  position: absolute;
  width: 100%;
  left: 0;
  top: 55px;
  height: 10px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  z-index: 2;
}
.tag-item {
  color: rgba(255, 255, 255, 0.5);
  font-size: 12px;
  text-shadow: 0 0 15px rgba(0, 0, 0, 0.9);
  flex: 1;
  text-align: center;
  cursor: pointer;
  transition: all 200ms ease-in-out;
}
.tag-item-active {
  color: rgba(255, 255, 255, 0.9);
}
</style>
