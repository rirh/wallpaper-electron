<template>
  <div class="home">
    <button @click="setWapper">setWapper</button>
  </div>
</template>

<script>
// @ is an alias to /src
export default {
  name: "Home",
  components: {},
  methods: {
    setWapper() {
      window.ipcRenderer.send(
        "setwapper",
        "/Users/zh/Documents/images/pap.er/JsjXnWlh8-g.jpg"
      );
    },
  },
};
</script>
