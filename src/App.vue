<template>
  <div class="app-main">
    <div class="box" v-if="ismac"></div>
    <div class="contant">
      <div class="header" :class="{ drag: !ismac }">
        <div class="bg"></div>
        <i @click="handleOpenSettingPage" class="setting el-icon-setting"></i>
      </div>
      <router-view />
    </div>
  </div>
</template>
<script>
export default {
  computed: {
    ismac() {
      return window.process.platform === "darwin";
    },
  },
  methods: {
    handleOpenSettingPage() {
      window.ipcRenderer.send("opensettingpage");
    },
  },
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
  border-radius: 10px;
  background-color: black;
}
.header {
  position: fixed;
  top: 10;
  left: 0;
  border-top-right-radius: 10px;
  border-top-left-radius: 10px;
  padding: 10px;
  /* background-color: black; */
  color: rgba(255, 255, 255, 1);
  width: 93%;
  background-image: url("./assets/wall.paper.png");
  background-size: cover;
  background-repeat: no-repeat;
  height: 40px;
  background-position: 40% 0%;
  z-index: 1;
  border-bottom: 1px solid #000;
}
.setting {
  position: absolute;
  right: 15px;
  top: 20px;
  color: rgba(255, 255, 255, 0.3);
  font-size: 20px;
  cursor: pointer;
  transition: all 200ms ease-in-out;
}
.setting:hover {
  color: rgba(255, 255, 255, 0.7);
}
</style>
