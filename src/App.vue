<template>
  <div class="app-main">
    <div class="box" v-if="ismac"></div>
    <div class="contant">
      <div class="header" :class="{ drag: !ismac }">
        <div class="bg"></div>
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
  left: calc(50% - 11px);
  top: -10px;
  width: 0px;
  height: 0px;
  border: 11px solid transparent;
  border-bottom: 16px solid black;
  z-index: -1;
}
.contant {
  height: calc(100vh - 12px);
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
  background-image: url("./assets/paper.png");
  background-size: cover;
  background-repeat: no-repeat;
  height: 40px;
  background-position: 40% -10%;
  z-index: 1;
}
</style>
