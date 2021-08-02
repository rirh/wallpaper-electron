<template lang="">
    <el-avatar
      fit="cover"
      class="avatar"
      ref="avatar"
      :src="currentUrl"
      shape="square"
    />
</template>
<script setup>
import { onBeforeUnmount, onMounted, ref, defineProps, toRefs } from "vue";
const props = defineProps({
  image: String
});
const intersectionObserver = ref({});
const currentUrl = ref("");
const avatar = ref(null);
const { image } = toRefs(props);

onMounted(() => {
  intersectionObserver.value = new IntersectionObserver(entries => {
    if (entries[0].intersectionRatio <= 0) return;
    if (!currentUrl.value) currentUrl.value = image.value;
  });
  if (avatar.value) {
    intersectionObserver.value.observe(avatar.value.$el);
    const randomColor = "#" + ((Math.random() * 0xffffff) << 0).toString(16);
    avatar.value.$el.style.backgroundColor = randomColor;
  }
});
onBeforeUnmount(() => {
  intersectionObserver.value && intersectionObserver.value.disconnect();
});
</script>
<style lang="less" scoped>
.avatar,
.avatar /deep/ img {
  height: 168px;
  width: 100%;
  object-fit: cover;
}
</style>
