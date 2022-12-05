<template>
  <canvas ref="bjsCanvas" />
</template>

<script>
import { createScene } from "../scenes/CvScene";

export default {
  name: "BabylonScene",
  mounted() {
    if (this.$refs.bjsCanvas) {
      createScene(this.$refs.bjsCanvas);
    }
  }
};
</script>

<style scoped>
canvas {
  width: 100%;
  height: 100vh;
}
</style>
