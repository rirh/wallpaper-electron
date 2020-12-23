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
            const uri = `C:\\Users\\Administrator\\Desktop\\wallhaven-l3qmwq.jpg`
            // const uri = '/Users/zh/Documents/images/pap.er/JsjXnWlh8-g.jpg'

      window.ipcRenderer.send(
        "setwapper",
        uri
      );
     
    },
  },
};
</script>
