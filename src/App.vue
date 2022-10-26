<template>
  <BabylonScene/>
</template>

<script>
import BabylonScene from "@/components/BabylonScene";

export default {
  name: 'App',
  components: {
    BabylonScene,
  }
}
</script>

<style>

body{
  width: 100%;
  height: 100vh;
  /*overflow-y: hidden;*/
}
*{
  margin: 0;
  padding: 0;
}
</style>
